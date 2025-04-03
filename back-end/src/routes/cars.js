const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const db = require("../database");

router.get("/", middleware.authGuard, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);

    if (
      (limit !== undefined && limit <= 0) ||
      (page !== undefined && page <= 0)
    ) {
      return res.status(400).json({
        error: "Query parameters 'limit' and 'page' must be positive integers.",
      });
    }

    // Page must be at least 1
    const cars = await db.getCars({
      limit: limit ? limit : 10,
      page: page ? page : 1,
    });
    res
      .status(200)
      .json({ cars, page: page ? page : 1, limit: limit ? limit : 10 });
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

      const car = await db.getCarById(Number(carId));
      res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
