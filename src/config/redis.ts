/* eslint-disable no-console */
import { createClient } from "redis";
import { loadEnv } from "./envs";

loadEnv();

export const redis = createClient();

redis.on("error", err => console.log("Redis Client Error", err));

export async function connectRedis() {
  await redis.connect();
}

export async function disconnectRedis() {
  await redis.disconnect();
}
