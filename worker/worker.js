const sharp = require("sharp");
const { initRedis, closeRedis } = require("../api/services/redisClient");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const redis = initRedis();

const s3 = new S3Client({
  endpoint: "http://localstack:4566",
  region: "us-east-1",
  forcePathStyle: true,
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const bucket = "my-bucket";

async function processQueue() {
  console.log("Worker started...");
  while (true) {
    try {
      const item = await redis.brpop("image_queue", 0);
      const { id, buffer } = JSON.parse(item[1]);
      const resized = await sharp(Buffer.from(buffer, "base64"))
        .resize(200)
        .toBuffer();
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: id, Body: resized }));
      console.log("Processed", id);
    } catch (err) {
      console.error("Error processing queue:", err);
    }
  }
}

processQueue();

process.on("SIGINT", async () => {
  await closeRedis();
  process.exit();
});