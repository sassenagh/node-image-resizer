const Redis = require("ioredis");
let redis;

function initRedis() {
  if (!redis) {
    redis = new Redis({ host: process.env.REDIS_HOST || "redis", port: 6379 });
    redis.on("connect", () => console.log("Redis connected"));
    redis.on("error", (err) => console.error("Redis error", err));
  }
  return redis;
}

async function closeRedis() {
  if (redis) {
    await redis.quit();
    console.log("Redis connection closed");
    redis = null;
  }
}

module.exports = { initRedis, closeRedis };