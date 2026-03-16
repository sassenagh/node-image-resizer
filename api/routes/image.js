const express = require("express");

module.exports = (redis, upload) => {
  const router = express.Router();

  router.post("/resize", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const id = Date.now().toString();

    await redis.lpush(
      "image_queue",
      JSON.stringify({ id, buffer: req.file.buffer.toString("base64") })
    );

    res.json({ message: "Image queued", id });
  });

  return router;
};