import { userService } from "../../users/services/user.service.js";
import { vehicleService } from "../../vehicles/services/vehicle.services.js";
import { httpClient } from '../../../shared/infra/http/httpClient.js';
import { config } from '../../../shared/config/config.js';
import { notificationConstants } from '../../../shared/constants/notifications.constants.js';
import { makeRepository as makeUserRepo } from '../../../modules/users/repositories/user.repository.js';
import { makeRepository as makeIntegrationsRepo } from '../repositories/activities.repository.js';
import { UserModel } from '../../users/models/user.model.js';
import { ActivitiesModel } from "../models/activities.model.js";
import { round } from "../../../shared/utils.js";

const makeService = (repository) => {
  const client = httpClient({ baseURL: config.strava.api_url });

  const handleActivity = async (event) => {
    // get user
    const stravaConfig = await _getStravaConfigBy({ userExtId: event.owner_id });
    if (!stravaConfig) return;

    // check if activity is a deletion
    const isDeletion = event.aspect_type === 'delete';
    const isUpdate = event.aspect_type === 'update';

    if (isDeletion) {
      await _deleteActivity(event, stravaConfig);
      return;
    }

    if (isUpdate) {
      await _updateActivity(event, stravaConfig);
      return;
    }

    await _createActivity(event, stravaConfig);
    return;
  }

  // Private functions
  const _getStravaActivityById = async (stravaConfig, activityId) => {
    try {
      // validate token
      const validatedConfig = await _validateStravaToken(stravaConfig);

      const response = await client.get(`/api/v3/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${validatedConfig.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.log("error getting strava activity. status: ", error.status, "data: ", error.data, "message: ", error.message);
      return null;
    }
  }
  
  const _createActivity = async (event, stravaConfig) => {
    // get activity details
    const activityDetails = await _getStravaActivityById(stravaConfig, event.object_id);
    if (!activityDetails) return;
    
    // check if activity is a ride
    if (activityDetails.type !== 'Ride' && !activityDetails.sport_type.includes('Ride')) return;

    // validate if there was saved in our database
    const localActivity = await _verifyAndSaveActivity({ ...event, integrationName: "strava" });
    if (localActivity?.distance > 0) return;

    // find vehicle by gear id
    const bikes = await vehicleService.getVehiclesBy({ "extId": activityDetails.gear_id, noReduce: true });
    if (!bikes.length) return;

    // update activity with distance
    const ourActivity = await repository.buildActivity(activityDetails, "strava");
    const updatedActivity = await repository.updateActivity(ourActivity);
    if (!updatedActivity) return;

    if (activityDetails.gear.converted_distance) {
      const bike = bikes[0];

      // add or subtract mileage to vehicle
      const distance = round(activityDetails.distance / 1000);
      const currentMileage = round(bike.displacement + distance);

      const updatedVehicle = await vehicleService.updateVehicle({
        userId: stravaConfig.user._id?.toString(),
        vehicleId: bike._id,
        displacement: currentMileage
      });

      // Update accumulated kilometers for maintenance tracking
      if (bike.maintenance && bike.maintenance.accumulatedKm !== undefined) {
        const currentAccumulatedKm = bike.maintenance.accumulatedKm || 0;
        const newAccumulatedKm = currentAccumulatedKm + distance;
        
        await vehicleService.updateVehicleMaintenance({
          userId: stravaConfig.user._id?.toString(),
          vehicleId: bike._id,
          maintenance: {
            accumulatedKm: newAccumulatedKm
          }
        });
      }

      // add notification to user telling that the vehicle was updated
      const lang = await _getUserLanguage(stravaConfig.user._id?.toString());
      const message = notificationConstants.find(n => n.notificationId === 1).message[lang];
      const notification = message.replace('{vehicle}', bike.fullname).replace('{distance}', distance.toFixed(2)).replace('{mileage}', updatedVehicle.displacement);
      await userService.addNotification({ _id: stravaConfig.user._id?.toString(), message: notification });
    }
  }

  const _updateActivity = async (event, stravaConfig) => {
    // get activity details
    const activityDetails = await _getStravaActivityById(stravaConfig, event.object_id);
    if (!activityDetails) return;
    
    // check if activity is a ride
    if (activityDetails.type !== 'Ride' && !activityDetails.sport_type.includes('Ride')) return;

    // find existing activity in our database
    const parsedEvent = repository.buildActivity(event, "strava");
    const localActivity = await repository.getActivityByExtId(parsedEvent);
    if (!localActivity) return;

    // calculate the difference in distance
    const oldDistance = localActivity.distance || 0;
    const newDistance = activityDetails.distance / 1000;
    const distanceDifference = newDistance - oldDistance;

    // update activity with new distance
    const ourActivity = await repository.buildActivity(activityDetails, "strava");
    const updatedActivity = await repository.updateActivity(ourActivity);
    if (!updatedActivity) return;

    if (activityDetails.gear.converted_distance && distanceDifference !== 0) {
      // find vehicle by gear id
      const bikes = await vehicleService.getVehiclesBy({ "extId": activityDetails.gear_id, noReduce: true });
      if (!bikes.length) return;
      const bike = bikes[0];

      // update vehicle mileaound
      const currentMileage = round(bike.displacement + distanceDifference);
      const updatedVehicle = await vehicleService.updateVehicle({
        userId: stravaConfig.user._id?.toString(),
        vehicleId: bike._id,
        displacement: currentMileage
      });

      // Update accumulated kilometers for maintenance tracking
      if (bike.maintenance && bike.maintenance.accumulatedKm !== undefined) {
        const currentAccumulatedKm = bike.maintenance.accumulatedKm || 0;
        const newAccumulatedKm = round(Math.max(0, currentAccumulatedKm + distanceDifference));
        
        await vehicleService.updateVehicleMaintenance({
          userId: stravaConfig.user._id?.toString(),
          vehicleId: bike._id,
          maintenance: {
            accumulatedKm: newAccumulatedKm
          }
        });
      }

      // add notification to user telling that the vehicle was updated
      const lang = await _getUserLanguage(stravaConfig.user._id?.toString());
      const message = notificationConstants.find(n => n.notificationId === 1).message[lang];
      const notification = message.replace('{vehicle}', bike.fullname).replace('{distance}', distanceDifference.toFixed(2)).replace('{mileage}', updatedVehicle.displacement);
      await userService.addNotification({ _id: stravaConfig.user._id?.toString(), message: notification });
    }
  }

  const _deleteActivity = async (event, stravaConfig) => {
    const parsedEvent = repository.buildActivity(event, "strava");
    const localActivity = await repository.getActivityByExtId(parsedEvent);
    if (!localActivity) return;
    
    // delete activity from our database
    await repository.deleteActivity(localActivity);

    if (!localActivity.vehicleExtId) return;
    
    // find vehicle by gear id
    const bikes = await vehicleService.getVehiclesBy({ "extId": localActivity.vehicleExtId, noReduce: true });
    if (!bikes.length) return;
    const bike = bikes[0];

    // add or subtract mileage to vehicle
    const distance = localActivity.distance;
    const currentMileage = round(bike.displacement - distance);

    const updatedVehicle = await vehicleService.updateVehicle({
      userId: stravaConfig.user._id?.toString(),
      vehicleId: bike._id,
      displacement: currentMileage
    });

    // Update accumulated kilometers for maintenance tracking (subtract the distance)
    if (bike.maintenance && bike.maintenance.accumulatedKm !== 0) {
      const currentAccumulatedKm = bike.maintenance.accumulatedKm || 0;
      const newAccumulatedKm = round(Math.max(0, currentAccumulatedKm - distance)); // Prevent negative values
      
      await vehicleService.updateVehicleMaintenance({
        userId: stravaConfig.user._id?.toString(),
        vehicleId: bike._id,
        maintenance: {
          accumulatedKm: newAccumulatedKm
        }
      });
    }

    // add notification to user telling that the vehicle was updated
    const lang = await _getUserLanguage(stravaConfig.user._id?.toString());
    const message = notificationConstants.find(n => n.notificationId === 2).message[lang];
    const notification = message.replace('{vehicle}', bike.fullname).replace('{distance}', distance.toFixed(2)).replace('{mileage}', updatedVehicle.displacement);
    await userService.addNotification({ _id: stravaConfig.user._id?.toString(), message: notification });
  }

  const _getUserLanguage = async (userId) => {
    const user = await userService.getUserById({ _id: userId });
    return user.language;
  }

  const _refreshStravaToken = async (stravaConfig) => {
    try {
      const params = {
        client_id: config.strava.clientId,
        client_secret: config.strava.clientSecret,
        refresh_token: stravaConfig.refreshToken,
        grant_type: 'refresh_token'
      };

      const response = await client.post('/oauth/token', params);

      // Update the user's integration with the new access token
      const dbconfig = await repository.updateUserBy({ _id: stravaConfig.user._id?.toString(), "integrations.name": "strava" }, {
        $set: {
          "integrations.$.refreshToken": response.data.refresh_token,
          "integrations.$.accessToken": response.data.access_token,
          "integrations.$.expiresAt": response.data.expires_at
        }
      });

      return dbconfig.integrations.find(i => i.name === "strava");
    } catch (error) {
      console.error("Error during Strava API call:", error.data || error.message);
      throw new Error('Error refreshing Strava token');
    }
  }

  const _validateStravaToken = async (stravaConfig) => {
    if (stravaConfig.expiresAt && stravaConfig.expiresAt < Math.floor(Date.now() / 1000)) {
      console.log("Strava token expired, refreshing...");
      stravaConfig = await _refreshStravaToken(stravaConfig);
    }

    return stravaConfig;
  }

  const _getStravaConfigBy = async ({ userId, userExtId }) => {
    let filter = {};

    if (userId) filter = { "integrations.user._id": userId };
    if (userExtId) filter = { "integrations.userId": userExtId };

    const users = await userService.getUsers(filter, true);
    if (!users.length) return;
    const user = users[0];

    const stravaConfig = user.integrations.find(integration => integration.name === "strava");
    if (!stravaConfig) return;

    return stravaConfig;
  }

  const _verifyAndSaveActivity = async (activity) => {
    const ourActivity = repository.buildActivity(activity, activity.integrationName);
    if (!ourActivity) return null;

    const existingActivity = await repository.getActivityByExtId(ourActivity);
    if (existingActivity) return existingActivity;

    return await repository.createActivity(ourActivity);
  }

  return {
    handleActivity
  }
}

export const stravaService = makeService({ ...makeUserRepo(UserModel), ...makeIntegrationsRepo(ActivitiesModel) }); 