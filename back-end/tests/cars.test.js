const request = require("supertest");
const app = require("../src/server");
const jwt = require("jsonwebtoken");
const clearAllData  = require("./test_utils");
const { PrismaClient } = require("@prisma/client");


describe("Cars API", () => {
  const prisma = new PrismaClient();

  const validToken = jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET,
  );

  const mockCar1 = {
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    generation: "12th",
    engine_size_cc: 1798,
    fuel_type: "Petrol",
    transmission: "CVT",
    drivetrain: "FWD",
    body_type: "Sedan",
    num_doors: 4,
    country: "Japan",
    mpg_city: 30.0,
    mpg_highway: 38.0,
    horsepower_hp: 139,
    torque_ftlb: 126,
    acceleration: 8.2,
    car_image_path: "/images/toyota_corolla_2020.jpg",
  };
  const mockCar2 = {
      make: "Honda",
      model: "Civic",
      year: 2021,
      generation: "11th",
      engine_size_cc: 1498,
      fuel_type: "Petrol",
      transmission: "Automatic",
      drivetrain: "FWD",
      body_type: "Sedan",
      num_doors: 4,
      country: "Japan",
      mpg_city: 32.0,
      mpg_highway: 42.0,
      horsepower_hp: 158,
      torque_ftlb: 138,
      acceleration: 7.8,
      car_image_path: "/images/honda_civic_2021.jpg",
  };
  beforeEach(async () => {
    await clearAllData();
    await prisma.car.createMany({
      data: [mockCar1, mockCar2],
    });
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
