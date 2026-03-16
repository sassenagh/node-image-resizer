const request = require("supertest");
const app = require("../api/app");

describe("Image API", () => {
  it("queues image successfully", async () => {
    const testImagePath = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    
    const res = await request(app)
      .post("/image/resize")
      .attach("image", testImagePath, 'test.png')
      .expect(200)
      .expect(function(res) {
        if (res.body.message !== 'Image queued') throw new Error('Wrong message');
        if (!res.body.id) throw new Error('No id');
      })
      .end(done);
  });
});
