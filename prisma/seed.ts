import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function createTicketTypes() {
  const ticketTypesFound = await prisma.ticketType.findFirst();
  if (ticketTypesFound) return ticketTypesFound;

  return prisma.ticketType.createMany({
    data: [
      {
        name: 'Presencial com Hotel',
        price: 25000,
        isRemote: false,
        includesHotel: true,
      },
      {
        name: 'Presencial sem Hotel',
        price: 15000,
        isRemote: false,
        includesHotel: false,
      },
      {
        name: 'Online',
        price: 5000,
        isRemote: true,
        includesHotel: false,
      },
    ]
  });
}

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  const ticketTypes = await createTicketTypes();

  console.log({ event });
  console.log({ ticketTypes });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
