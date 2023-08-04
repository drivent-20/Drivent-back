import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import redisService from "../redis-service";

const cacheKeys = {
  EVENT: "event"
};

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cachedEvent = await redisService.get(cacheKeys.EVENT);
  if (cachedEvent) return exclude(cachedEvent, "createdAt", "updatedAt") as GetFirstEventResult;

  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  redisService.set({ key: cacheKeys.EVENT, value: event });
  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const cachedEvent = await redisService.get(cacheKeys.EVENT);

  const event = cachedEvent || await eventRepository.findFirst();
  if (!event) return false;

  if (!cachedEvent) redisService.set({ key: cacheKeys.EVENT, value: event });

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
