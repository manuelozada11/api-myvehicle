export const makeRepository = (ActivitiesModel) => {
  const createActivity = async (data) => {
    return await ActivitiesModel.create(data, { new: true });
  }

  const getActivityByExtId = async ({ userExtId, activityId, integrationName }) => {
    return await ActivitiesModel.findOne({ userExtId, activityId, integrationName });
  }

  const verifyAndSaveActivity = async (activity) => {
    const ourActivity = buildActivity(activity, activity.integrationName);
    if (!ourActivity) return null;

    const existingActivity = await getActivityByExtId(ourActivity);
    if (existingActivity) return existingActivity;

    return await createActivity(ourActivity);
  }

  const updateActivity = async (activity) => {
    const updated = await ActivitiesModel.findOneAndUpdate({ activityId: activity.activityId }, activity, { new: true });
    if (!updated) return null;

    return updated;
  }

  const deleteActivity = async (activity) => {
    await ActivitiesModel.findOneAndDelete({ activityId: activity.activityId });
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
    verifyAndSaveActivity,
    updateActivity,
    deleteActivity,
    buildActivity
  }
}