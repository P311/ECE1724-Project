const express = require("express");
const router = express.Router();

const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");
const reviewRoutes = require("./routes/reviews");

router.use("/users", userRoutes);
router.use("/cars", carRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
