const express = require("express");
const router = express.Router();

const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");

router.use("/users", userRoutes);
router.use("/cars", carRoutes);

module.exports = router;
