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
      // TODO: Fetch comparisons for the user
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
