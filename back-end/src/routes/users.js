const express = require("express");
const router = express.Router();
// TODO: Implement database operations
const db = null;
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
      res.status(201).json(user);
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
    // TODO use bcrypt to compare the password
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    delete profile.password;
    res.status(200).json({ token: token, user: profile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
