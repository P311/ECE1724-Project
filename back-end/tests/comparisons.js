const request = require("supertest");
const app = require("../src/server");
const jwt = require("jsonwebtoken");
const utils  = require("./test_utils");

describe("Comparisons API", () => {
  const validToken = jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET,
  );

  beforeEach(async () => {
    // Clear any existing data and insert mock data
    await utils.clearAllData();
    await utils.insertMockComparisons();
  });

  describe("GET /api/comparisons", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/comparisons");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 with a list of comparisons if token is valid", async () => {
      const res = await request(app)
        .get("/api/comparisons")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      // should get current user's comparisons only
      expect(res.body.length).toEqual(1);
      expect(res.body[0].id).toEqual(1);
    });
  });

  describe("POST /api/comparisons", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .post("/api/comparisons")
        .send({ cars: [1, 2] });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 201 if comparison is created successfully", async () => {
      const res = await request(app)
        .post("/api/comparisons")
        .set("Authorization", validToken)
        .send({ cars: [1, 2] });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Comparison created successfully",
      );
    });
  });

  describe("DELETE /api/comparisons/:id", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).delete("/api/comparisons/1");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 204 if comparison is deleted successfully", async () => {
      const res = await request(app)
        .delete("/api/comparisons/1")
        .set("Authorization", validToken);
      expect(res.status).toBe(204);
    });
  });
});
