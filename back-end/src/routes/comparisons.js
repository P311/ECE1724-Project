const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// TODO: Implement database operations
const db = null;

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

router.get("/:id", middleware.authGuard, async (req, res, next) => {
  try {
    const comparisonId = req.params.id;
    // TODO: Fetch comparison details by ID
    const comparison = await db.getComparisonById(comparisonId);
    if (!comparison) {
      return res.status(404).json({ error: "Comparison does not exist" });
    }
    res.status(200).json(comparison);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  middleware.authGuard,
  middleware.validateComparisonForm,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { cars } = req.body;
      // TODO: Validate car IDs and create comparison
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
      // TODO: Delete comparison by ID
      const deleted = await db.deleteComparison(comparisonId);
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
