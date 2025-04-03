const request = require("supertest");
const app = require("../src/server");
const jwt = require("jsonwebtoken");
const utils  = require("./test_utils");
const { PrismaClient } = require("@prisma/client");


describe("Cars API", () => {
  const prisma = new PrismaClient();

  const validToken = jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET,
  );

  const mockCar1 = utils.mockCar1;

  beforeEach(async () => {
    await utils.clearAllData();
    await utils.insertMockCars();
  });

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
      expect(res.body).toHaveProperty("page");
      expect(res.body).toHaveProperty("limit");
    });

    it("should return only 1 car if limit is 1", async () => {
      const res = await request(app)
        .get("/api/cars?limit=1")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body.cars.length).toBe(1);
      expect(res.body.cars[0]).toEqual({id:1, ...utils.mockCar1});
    });

    it("should return the second car if page is 2 with limit 1", async () => {
      await utils.clearAllData();
      await utils.insertMockCars();
      const res = await request(app)
        .get("/api/cars?limit=1&page=2")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body.cars.length).toBe(1);
      expect(res.body.cars[0]).toEqual({id:2, ...utils.mockCar2});
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
      expect(res.body).toEqual({ error: "Car does not exist" });
      expect(res.status).toBe(404);
    });

    it("should return 200 with car details if car exists", async () => {
      const res = await request(app)
        .get("/api/cars/1")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({id: 1, ...mockCar1});
    });
  });
});
