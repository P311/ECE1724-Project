const express = require("express");
const router = express.Router();

const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");
const reviewRoutes = require("./routes/reviews");
const comparisonRoutes = require("./routes/comparisons");

router.use("/users", userRoutes);
router.use("/cars", carRoutes);
router.use("/reviews", reviewRoutes);
router.use("/comparisons", comparisonRoutes);

module.exports = router;
