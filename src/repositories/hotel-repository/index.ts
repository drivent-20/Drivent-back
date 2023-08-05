import { prisma } from "@/config";

async function findHotels() {
  const hotels = await prisma.hotel.findMany({
    include: {
      Rooms: {
        include: {
          Booking: true,
        }
      }
    },
  });

  function calculateAvailableRooms(hotel: any) {
    let totalCapacity = 0;
    let occupied = 0;

    for (const room of hotel.Rooms) {
      totalCapacity += room.capacity;
      occupied += room.Booking.length; 
    }

    return totalCapacity - occupied;
  }

  function checkRoomsType(hotel: any) {
    let isSingle = false;
    let isDouble = false;
    let isTriple = false;
    let result = ""
    for (const room of hotel.Rooms) {
      if(room.capacity === 1) isSingle = true;
      if(room.capacity === 2) isDouble = true;
      if(room.capacity === 3) isTriple = true;
    }

    if(isSingle) result += 'S';
    if(isDouble) result += 'D';
    if(isTriple) result += 'T';

    return result;
  }

  const availableRooms = hotels.map(calculateAvailableRooms);

  const roomsType = hotels.map(checkRoomsType);

  return hotels.map((hotel, index) => ({ ...hotel, availableRooms: availableRooms[index], roomsType: roomsType[index] }));
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;
