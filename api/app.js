const express = require("express");
const multer = require("multer");
const { initRedis, closeRedis } = require("./services/redisClient");
const imageRoutes = require("./routes/image");

const upload = multer({ storage: multer.memoryStorage() });

let isReady = false;

const redis = initRedis();

if (redis && redis.on) {
  redis.on("connect", () => {
    console.log("Redis connected");
    isReady = true;
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err);
    isReady = false;
  });
}

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ready", async (req, res) => {
  try {
    if (!redis) {
      return res.status(503).json({ status: "not ready" });
    }

    if (isReady) {
      return res.status(200).json({ status: "ready" });
    }

    return res.status(503).json({ status: "not ready" });
  } catch (err) {
    return res.status(503).json({ status: "not ready" });
  }
});

app.use("/image", imageRoutes(redis, upload));

const server = app.listen(3000, () =>
  console.log("API running...")
);

// 🔻 Shutdown limpio (como ya hacías)
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await closeRedis();
  server.close(() => console.log("Server closed"));
});

module.exports = app;