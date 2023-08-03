/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { createClient } from "redis";
import { loadEnv } from "./envs";

loadEnv();

// REDIS_URL não é obrigatório.
const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on("error", err => console.log("Redis Client Error", err));

export async function connectRedis() {
  await redis.connect();
}

export async function disconnectRedis() {
  await redis.disconnect();
}
