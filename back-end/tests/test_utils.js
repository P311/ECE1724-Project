const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../src/server");
const request = require("supertest");

async function clearAllData() {
    // force delete even if violates foreign key constraints
    await prisma.review.deleteMany(),
    await prisma.comparison.deleteMany(),
    await prisma.car.deleteMany(),
    await prisma.user.deleteMany(),
    
    // reset id increment
    await prisma.$executeRaw`ALTER SEQUENCE "Car_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Comparison_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Review_id_seq" RESTART WITH 1;`;
}

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

async function insertMockCars() {
  await prisma.car.createMany({
    data: [mockCar1, mockCar2],
  });
}

const mockReview1 = {
  user_id: 1,
  car_id: 1,
  grade: 5,
  content: "Bat Mobile is the best!",
}

const mockReview2 = {
  user_id: 1,
  car_id: 1,
  grade: 3,
  content: "Bat Mobile can fly",
}

const mockReview3 = {
  user_id: 2,
  car_id: 2,
  grade: 5,
  content: "Prefer Joker's car",
}

async function insertMockReviews() {
  await registerMockUser();
  await insertMockCars();
  await prisma.review.createMany({
    data: [mockReview1, mockReview2],
  });
  const reviews = [];
  for (let i = 0; i < 20; i++) {
    reviews.push({
      user_id: 2,
      car_id: 2,
      grade: 4,
      content: `Joker's ${i} car is the best`,
    })
  };
  await prisma.review.createMany({
    data: reviews,
  });
}

const mockUser1 = {
  username: "testuser1",
  email: "testuser1@gmail.com",
  password: "Password123!",
};

const mockUser2 = {
  username: "testuser2",
  email: "testuser2@gmail.com",
  password: "Password321?",
};

async function registerMockUser() {
  await request(app).post("/api/users/register").send(mockUser1);
  await request(app).post("/api/users/register").send(mockUser2);
}

module.exports = {clearAllData, insertMockCars, insertMockReviews, registerMockUser, mockReview1, mockReview2, mockReview3, mockUser1, mockUser2, mockCar1, mockCar2};