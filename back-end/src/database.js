const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { get } = require("./routes/users");

const dbOperations = {
  // db operations on Car
  checkCarIdExist: async (carId) => {
    try {
      const car = await prisma.car.findUnique({
        where: {
          id: carId,
        },
      });
      return car;
    } catch (error) {
      throw error;
    }
  },
  getCars: async (filters = {}) => {
    try {
      const cars = await prisma.car.findMany({
        where: {
          ...(filters.make && { make: filters.make }),
          ...(filters.model && { model: filters.model }),
          ...(filters.country && { country: filters.country }),
          ...(filters.type && { type: filters.type }),
        },
        take: filters.limit,
        skip: (filters.page - 1) * filters.limit,
        orderBy: {
          id: "asc",
        },
      });

      return cars;
    } catch (error) {
      throw error;
    }
  },

  getCarsOptions: async () => {
    // Get all unique values for make and model combination, country, and type
    try {
      const makesRaw = await prisma.car.findMany({
        distinct: ["make", "model"],
        select: {
          make: true,
          model: true,
        },
      });

      const makes = makesRaw.reduce((acc, { make, model }) => {
        const existingMake = acc.find((item) => item.make === make);
        if (existingMake) {
          existingMake.model.push(model);
        } else {
          acc.push({ make, model: [model] });
        }
        return acc;
      }, []);
      const countriesRaw = await prisma.car.findMany({
        distinct: ["country"],
        select: {
          country: true,
        },
      });

      const countries = countriesRaw
        .map(({ country }) => country)
        .filter((country) => country !== null);

      const typesRaw = await prisma.car.findMany({
        distinct: ["body_type"],
        select: {
          body_type: true,
        },
      });

      const types = typesRaw
        .map(({ body_type }) => body_type)
        .filter((body_type) => body_type !== null);

      return { makes, countries, types };
    } catch (error) {
      throw error;
    }
  },

  getCarById: async (carId) => {
    try {
      const car = await prisma.car.findUnique({
        where: {
          id: carId,
        },
      });
      if (!car) {
        return null;
      }
      return car;
    } catch (error) {
      throw error;
    }
  },

  // db operations on Comparison
  checkComparisonExists: async (comparisonId) => {
    try {
      const comparison = await prisma.comparison.findUnique({
        where: {
          id: comparisonId,
        },
      });
      return comparison;
    } catch (error) {
      throw error;
    }
  },
  createComparison: async (userId, cars) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        console.warn(`User with userId: ${userId} is not found in db`);
        return "User not found in database.";
      }

      const carObjects = [];
      for (const carId of cars) {
        const car = await prisma.car.findUnique({
          where: {
            id: carId,
          },
        });
        if (car) {
          carObjects.push(car);
        } else {
          console.warn(`Car with carId: ${carId} is not found in db`);
        }
      }

      const comparison = await prisma.comparison.create({
        data: {
          user_id: userId,
          cars: {
            connect: cars.map((car) => ({ id: car })),
          },
        },
        include: {
          cars: {
            orderBy: { id: "asc" },
          },
        },
      });
      return comparison;
    } catch (error) {
      throw error;
    }
  },

  getComparisonsByUserId: async (userId) => {
    try {
      const comparisons = await prisma.comparison.findMany({
        where: {
          user_id: userId,
        },
        include: {
          cars: {
            orderBy: { id: "asc" },
          },
        },
      });

      return comparisons;
    } catch (error) {
      throw error;
    }
  },

  getComparisonById: async (comparisonId) => {
    try {
      const comparison = await prisma.comparison.findUnique({
        where: {
          id: comparisonId,
        },
        include: {
          cars: {
            orderBy: { id: "asc" },
          },
        },
      });
      return comparison;
    } catch (error) {
      throw error;
    }
  },

  deleteComparison: async (comparisonId) => {
    try {
      const deletedComparison = await prisma.comparison.delete({
        where: {
          id: comparisonId,
        },
        include: {
          cars: {
            orderBy: { id: "asc" },
          },
        },
      });
      return deletedComparison;
    } catch (error) {
      throw error;
    }
  },

  // db operations on reviews
  checkReviewExists: async (reviewId) => {
    try {
      const review = await prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });
      return review;
    } catch (error) {
      throw error;
    }
  },
  createReview: async (userId, carId, grade, content) => {
    try {
      const car = await prisma.car.findUnique({
        where: {
          id: carId,
        },
      });

      if (!car) {
        console.warn(`Car with carId ${carId} is not found in db`);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        console.warn(`User with userId ${userId} is not found in db`);
      }

      const review = await prisma.review.create({
        data: {
          grade,
          content,
          car_id: carId,
          user_id: userId,
        },
        include: {
          car: true,
          user: true,
        },
      });

      return review;
    } catch (error) {
      throw error;
    }
  },

  getReviewsByCarId: async (car_id, page) => {
    try {
      const limit = 10; // Default 10 Reviews per fetch
      const reviews = await prisma.review.findMany({
        where: {
          car_id: car_id,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { id: "asc" },
      });

      return reviews;
    } catch (error) {
      throw error;
    }
  },

  getReviewsByUserId: async (userId) => {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          user_id: userId,
        },
        orderBy: { id: "asc" },
      });

      return reviews;
    } catch (error) {
      throw error;
    }
  },

  updateReviewLikesDislikes: async (reviewId, action) => {
    try {
      const updatedReview = await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          // conditional object properties
          ...(action === "like" && { num_likes: { increment: 1 } }),
          ...(action === "dislike" && { dislikes: { increment: 1 } }),
        },
      });

      if (action === "like") {
        await prisma.user.update({
          where: {
            id: updatedReview.user_id,
          },
          data: {
            num_likes: { increment: 1 },
          },
        });
      }
      return updatedReview;
    } catch (error) {
      throw error;
    }
  },
  deleteReview: async (reviewId) => {
    try {
      const deletedReview = await prisma.review.delete({
        where: {
          id: reviewId,
        },
      });

      return deletedReview;
    } catch (error) {
      throw error;
    }
  },

  // db operations on users
  checkUserExists: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },
  createUser: async (username, password, email) => {
    try {
      // ref: https://www.npmjs.com/package/bcrypt
      const passwordHash = bcrypt.hashSync(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password_hash: passwordHash,
          email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  findUserByUsername: async (username) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
