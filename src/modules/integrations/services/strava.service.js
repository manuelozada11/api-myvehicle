import { userService } from "../../users/services/user.service.js";
import { vehicleService } from "../../vehicles/services/vehicle.services.js";
import { httpClient } from '../../../shared/infra/http/httpClient.js';
import { config } from '../../../shared/config/config.js';
import { notificationConstants } from '../../../shared/constants/notifications.constants.js';
import { makeRepository } from '../../../modules/users/repositories/user.repository.js';
import { UserModel } from '../../users/models/user.model.js';

const makeService = (repository) => {
  const client = httpClient({ baseURL: config.strava.api_url });

  const handleActivity = async (event) => {
    // get user
    const stravaConfig = await _getStravaConfigBy({ userExtId: event.owner_id });
    if (!stravaConfig) return;
    
    // get activity details
    const activityDetails = await getStravaActivityById(stravaConfig, event.object_id);
    if (!activityDetails) return;

    // check if activity is a ride
    if (activityDetails.type !== 'Ride' && !activityDetails.sport_type.includes('Ride')) return;

    // find vehicle by gear id
    const bikes = await vehicleService.getVehiclesBy({ "extId": activityDetails.gear_id });
    if (!bikes.length) return;

    // check if activity is a deletion
    const isDeletion = event.aspect_type === 'delete';

    // add or subtract mileage to vehicle
    if (activityDetails.gear.converted_distance) {
      const distance = (activityDetails.distance / 1000).toFixed(2);
      const updatedVehicle = await vehicleService.updateVehicle({
        userId: stravaConfig.user._id?.toString(),
        vehicleId: bikes[0]._id,
        displacement: bikes[0].displacement + distance
      });

      // add notification to user telling that the vehicle was updated
      const lang = await _getUserLanguage(stravaConfig.user._id?.toString());
      const message = notificationConstants.find(n => n.notificationId === isDeletion ? 2 : 1).message[lang];
      const notification = message.replace('{vehicle}', bikes[0].fullname).replace('{distance}', distance).replace('{mileage}', updatedVehicle.displacement);
      await userService.addNotification({ _id: stravaConfig.user._id?.toString(), message: notification });
    }
  }

  const getStravaActivityById = async (stravaConfig, activityId) => {
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

  // Private functions
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

  const _getUserLanguage = async (userId) => {
    const user = await userService.getUserById({ _id: userId });
    return user.language;
  }

  return {
    handleActivity
  }
}

export const stravaService = makeService({ ...makeRepository(UserModel) }); 