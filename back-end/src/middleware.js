const e = require("express");
const jwt = require("jsonwebtoken");

// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

const validateRegisterInfo = (form) => {
  const errors = [];
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

  return errors;
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

module.exports = {
  requestLogger,
  validateRegisterInfo,
  authGuard,
  errorHandler,
};
