const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// TODO: Implement database operations
const db = null;

router.get("/", middleware.authGuard, async (req, res, next) => {
  try {
    // TODO: Fetch cars with pagination
    const cars = await db.getCars({ limit: 10 });
    res.status(200).json({ cars, offset: 0 });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  middleware.authGuard,
  middleware.checkCarIdExist,
  async (req, res, next) => {
    try {
      const carId = req.params.id;
      // TODO: Fetch car details by ID
      const car = await db.getCarById(carId);
      res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
