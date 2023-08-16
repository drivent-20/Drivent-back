import activityRepository from "@/repositories/activity-repository";

async function getAllActivities() {
  const activities = await activityRepository.findActivities();
  return activities;
}

async function findActivitiesByDate(date: string) {
  console.log('service date= ' + date);

  const dateFilter = date.substring(0, 11);

  console.log('service dateFilter=' +dateFilter)

  const activities = await activityRepository.findActivitiesByDate(dateFilter);
  return activities;

}

const activityService = {
  getAllActivities,
  findActivitiesByDate,
};

export default activityService;

