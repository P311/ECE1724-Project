const request = require("supertest");
const app = require("../src/server");
const jwt = require("jsonwebtoken");

describe("Cars API", () => {
  const validToken = jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET,
  );

  describe("GET /api/cars", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/cars");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 with a list of cars if token is valid", async () => {
      const res = await request(app)
        .get("/api/cars")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("cars");
      expect(res.body).toHaveProperty("offset");
    });
  });

  describe("GET /api/cars/:id", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/cars/1");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 404 if car does not exist", async () => {
      const res = await request(app)
        .get("/api/cars/999")
        .set("Authorization", validToken);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Car does not exist" });
    });

    it("should return 200 with car details if car exists", async () => {
      const res = await request(app)
        .get("/api/cars/1")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("make");
    });
  });
});
