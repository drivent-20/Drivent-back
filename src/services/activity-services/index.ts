import activityRepository from "@/repositories/activity-repository";

async function getAllActivities() {
  const activities = await activityRepository.findActivities();
  return activities;
}

const activityService = {
  getAllActivities,
};

export default activityService;

