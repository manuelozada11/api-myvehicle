export const makeRepository = (ActivitiesModel) => {
  const createActivity = async (data) => {
    return ActivitiesModel.create(data);
  }

  const getActivityByExtId = async ({ userExtId, activityId, integrationName }) => {
    return ActivitiesModel.findOne({ userExtId, activityId, integrationName });
  }

  const updateActivity = async (activity) => {
    return ActivitiesModel.findOneAndUpdate({ activityId: activity.activityId }, activity, { new: true });
  }

  const deleteActivity = async (activity) => {
    ActivitiesModel.findOneAndDelete({ activityId: activity.activityId });
  }

  const buildActivity = (event, integrationName) => {
    switch (integrationName) {
      case "strava":
        return {
          userExtId: event.owner_id ?? event.athlete.id,
          integrationName: "strava",
          activityId: event.object_id ?? event.id,
          distance: event?.distance > 0 ? Number((event.distance / 1000).toFixed(2)) : undefined,
          vehicleExtId: event.gear_id,
        };
      default:
        return null;
    }
  }

  return {
    createActivity,
    getActivityByExtId,
    updateActivity,
    deleteActivity,
    buildActivity
  }
}