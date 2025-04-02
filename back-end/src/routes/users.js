const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post(
  "/register",
  middleware.validateRegisterInfo,
  async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      // TODO: createUser
      const user = await db.createUser(username, password, email);

      delete user.password_hash; // Remove password hash from the response
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Email and password are required.",
      });
    }

    // Check if email and password are valid

    const user = await db.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const profile = { ...user };
    delete profile.password_hash;
    res.status(200).json({ token: token, user: profile });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user profile from the database
    const user = await db.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = { ...user };
    delete profile.password;
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
