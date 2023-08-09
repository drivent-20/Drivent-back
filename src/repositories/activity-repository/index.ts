import { prisma } from "@/config";

async function findActivities() {
  return prisma.activity.findMany({
    include: { Local: true }
  });
}

async function findActivitiesByDate(date: string) {
  return prisma.activity.findMany({
    where: {
      startsAt: date
    }
  });
}

const activityRepository = {
  findActivities,
  findActivitiesByDate
};

export default activityRepository;
