const express = require("express");
const multer = require("multer");
const { initRedis, closeRedis } = require("./services/redisClient");
const imageRoutes = require("./routes/image");

const upload = multer({ storage: multer.memoryStorage() });
const redis = initRedis();

const app = express();
app.use(express.json());

app.use("/image", imageRoutes(redis, upload));

const server = app.listen(3000, () =>
  console.log("API running on http://localhost:3000")
);

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await closeRedis();
  server.close(() => console.log("Server closed"));
});

module.exports = app;