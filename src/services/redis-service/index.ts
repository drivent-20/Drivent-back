import redis from "@/repositories/redis-repository";
import { SetOptions } from "redis";
import { isTestMode } from "@/utils/env-utils";

export const DEFAULT_EXP_SECONDS = 60;

export type RedisSetDataParams = {
  key: string;
  value: string | object;
  options?: SetOptions;
}

async function set({ key, value, options = { EX: DEFAULT_EXP_SECONDS } }: RedisSetDataParams) {
  if (isTestMode()) return null;
  const keyFound = await get(key);
  if (keyFound) return keyFound;
  return redis.set(key, JSON.stringify(value), options);
}

async function get(key: string) {
  if (isTestMode()) return null;
  return JSON.parse(await redis.get(key));
}

const redisService = { set, get };

export default redisService;
