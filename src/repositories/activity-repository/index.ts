import { prisma } from "@/config";

async function findActivities() {
  return prisma.activity.findMany({
    include: { Local: true }
  });
}

async function findActivitiesByDate(dateFilter: string) {
  const filters = {
    startsAt: {
      // Usando DateTimeFilter para filtrar pelo modelo "Activity"
      gt: new Date(dateFilter + "00:00:00Z"), // Filtrar atividades que começam após esta data
      lt: new Date(dateFilter + "23:59:59Z") // ajuste para o final do dia
    },
  };

  return prisma.activity.findMany({
    where: filters     
    
  });
}

const activityRepository = {
  findActivities,
  findActivitiesByDate
};

export default activityRepository;
