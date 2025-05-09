const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const db = require("../database");

router.get(
  "/",
  middleware.authGuard,
  middleware.checkUserExists,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page = 1 } = req.query;
      if (!Number.isInteger(Number(page)) || page <= 0) {
        return res.status(400).json({
          error: "Invalid Input",
          message: "Page must be a positive integer",
        });
      }
      const comparisons = await db.getComparisonsByUserId(userId);
      res.status(200).json(comparisons);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  middleware.authGuard,
  middleware.checkComparisonExists,
  async (req, res, next) => {
    try {
      const comparisonId = req.params.id;
      const comparison = await db.getComparisonById(Number(comparisonId));
      if (comparison.user_id != req.user.id) {
        return res
          .status(403)
          .json({ error: "You do not own this comparison" });
      }
      res.status(200).json(comparison);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  middleware.authGuard,
  middleware.validateComparisonForm,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { cars } = req.body;
      const comparison = await db.createComparison(userId, cars);
      res.status(201).json({
        message: "Comparison created successfully",
        id: comparison.id,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  middleware.authGuard,
  middleware.checkComparisonExists,
  async (req, res, next) => {
    try {
      const comparisonId = req.params.id;
      const deleted = await db.deleteComparison(Number(comparisonId));
      if (!deleted) {
        return res
          .status(400)
          .json({ error: "Invalid Input", message: "Invalid comparison id" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
