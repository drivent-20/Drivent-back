import { Hotel, PrismaClient, Room, } from "@prisma/client";
import dayjs from "dayjs";
import faker from "@faker-js/faker";

const prisma = new PrismaClient();

async function createInitialTicketTypes() {
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

function createInitialRooms(quantity = 20) {
  const rooms: Pick<Room, 'capacity' | 'name'>[] = [];
  for (let i = 0; i < quantity; i++) {
    const room = {
      capacity: faker.datatype.number({
        min: 1,
        max: 5
      }),
      name: faker.datatype.number({
        min: 1,
        max: 200
      }).toString(),
    };
    rooms.push(room);
  }
  return rooms;
}

const hotelsImagesUrls = [
  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22443290.jpg?k=ea72ebbd18972a57df7d0894168904b7abf1d0d1e4e84dadcaee0d4278f467ff&o=&hp=1',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3aUjaglNTdWCWPM7o8dRz6PEosjDKoAHCkExu8O1scVA64MZSJ_AFiaXDOTbyqKjGVWM&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dEwOb8aCwl457d-k9xo2cwlAbz2zwH8tXA&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTnNAicqJJrrLkLhB9DAouOFz1K8MKjiEVqdGxYR9echXan52Ac0j-c0r_-6bGP4uzUBE&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7SNOs9-LnUngPVCazkxYkxPLo8wWb3xOk4A&usqp=CAU'
]

async function createInitialHotelsWithRooms(quantity = 5) {
  const hotelFound = await prisma.hotel.findFirst();
  if (hotelFound) return hotelFound;

  const hotelsPromises: Promise<Hotel>[] = [];
  for (let i = 0; i < quantity; i++) {
    hotelsPromises.push(prisma.hotel.create({
      data:
      {
        name: faker.company.companyName(),
        image: hotelsImagesUrls[i],
        Rooms: {
          createMany: {
            data: createInitialRooms()
          }
        }
      }
    }));
  }

  return Promise.all(hotelsPromises);
}

async function createInitialEvent() {
  const event = await prisma.event.findFirst();
  if (event) return event;

  return prisma.event.create({
    data: {
      title: "Driven.t",
      logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
      backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(21, "days").toDate(),
    },
  });
}

async function main() {
  const event = await createInitialEvent();
  const ticketTypes = await createInitialTicketTypes();
  const hotels = await createInitialHotelsWithRooms();

  console.log({ event });
  console.log({ ticketTypes });
  console.log({ hotels });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
