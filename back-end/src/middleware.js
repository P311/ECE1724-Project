const e = require("express");
const jwt = require("jsonwebtoken");
const db = require("./database");

// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

const validateRegisterInfo = async (req, res, next) => {
  const form = req.body;
  
  const errors = [];
  // Check if email is an existing user
  if (form.email) {
    const userExists = await db.findUserByEmail(form.email);
    if (userExists) {
      errors.push("Email is already registered");
    }
  }

  if (!form.username || typeof form.username !== "string") {
    errors.push("Invalid username");
  } else if (form.username.length < 3 || form.username.length > 15) {
    errors.push("Invalid username");
  } else if (!/^[a-zA-Z0-9._-]+$/.test(form.username)) {
    errors.push("Invalid username");
  }

  if (!form.password || typeof form.password !== "string") {
    errors.push("Invalid password");
  } else if (form.password.length < 8 || form.password.length > 20) {
    errors.push("Invalid password");
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.push("Invalid password");
  }

  if (!form.email || typeof form.email !== "string") {
    errors.push("Invalid email");
  } else if (
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.email)
  ) {
    errors.push("Invalid email");
  }
  if (errors.length > 0) {
    console.log(errors);
    return res.status(400).json({ errors: errors });
  } else {
    next();
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

const authGuard = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const checkUserExists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // TODO: Implement database operation to check if user exists
    const userExists = await db.checkUserExists(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User does not exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkCarIdExist = async (req, res, next) => {
  try {
    const carId = req.params.id || req.body.car_id || req.query.car_id;
    // TODO: Implement database operation to check if car ID exists
    const carExists = await db.checkCarIdExist(carId);
    if (!carExists) {
      return res.status(404).json({ error: "Car does not exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const validateComparisonForm = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cars } = req.body;

    // Validate userId exists in the database
    // TODO: Implement database operation to check if user exists
    const userExists = await db.checkUserExists(userId);
    if (!userExists) {
      return res
        .status(400)
        .json({ error: "Invalid Input", message: "Invalid user id" });
    }

    // Validate cars is a non-empty array and each car ID exists in the database
    if (!Array.isArray(cars) || cars.length === 0) {
      return res.status(400).json({
        error: "Invalid Input",
        message: "Cars must be a non-empty list",
      });
    }

    for (const carId of cars) {
      // TODO: Implement database operation to check if car ID exists
      const carExists = await db.checkCarIdExist(carId);
      if (!carExists) {
        return res.status(400).json({
          error: "Invalid Input",
          message: `Invalid car id: ${carId}`,
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

const checkComparisonExists = async (req, res, next) => {
  try {
    const comparisonId = req.params.id;
    // TODO: Implement database operation to check if comparison exists
    const comparisonExists = await db.checkComparisonExists(comparisonId);
    if (!comparisonExists) {
      return res.status(404).json({ error: "Comparison does not exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkReviewExists = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    // TODO: Implement database operation to check if review exists
    const reviewExists = await db.checkReviewExists(reviewId);
    if (!reviewExists) {
      return res.status(404).json({ error: "Review does not exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const validateReviewForm = async (req, res, next) => {
  try {
    const { car_id, grade, content } = req.body;

    // Validate car_id exists in the database
    // TODO: Implement database operation to check if car ID exists
    if (!Number.isInteger(car_id)) {
      return res
        .status(400)
        .json({ error: "Invalid Input", message: "Invalid car id" });
    }

    // Validate grade is a positive integer from 1 to 5
    if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
      return res.status(400).json({
        error: "Invalid Input",
        message: "Grade must be an integer between 1 and 5",
      });
    }

    // Validate content is a string within 4096 characters
    if (
      typeof content !== "string" ||
      content.length === 0 ||
      content.length > 4096
    ) {
      return res.status(400).json({
        error: "Invalid Input",
        message: "Content must be a non-empty string within 4096 characters",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestLogger,
  validateRegisterInfo,
  authGuard,
  errorHandler,
  checkUserExists,
  checkCarIdExist,
  validateComparisonForm,
  checkComparisonExists,
  checkReviewExists,
  validateReviewForm,
};
