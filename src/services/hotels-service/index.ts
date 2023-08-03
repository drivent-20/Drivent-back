import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import redisService from "../redis-service";

const cacheKeys = {
  HOTELS: "hotels",
  HOTEL_WITH_ROOMS: "hotelsWithRooms"
};

async function listHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const cachedHotels = await redisService.get(cacheKeys.HOTELS);
  if (cachedHotels) return cachedHotels;

  const hotels = await hotelRepository.findHotels();

  await redisService.set({ key: cacheKeys.HOTELS, value: hotels });
  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);

  const cachedHotel = await redisService.get(cacheKeys.HOTEL_WITH_ROOMS);
  if (cachedHotel) return cachedHotel;

  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  await redisService.set({ key: cacheKeys.HOTEL_WITH_ROOMS, value: hotel });
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
