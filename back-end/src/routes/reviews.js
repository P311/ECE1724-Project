const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// TODO: Implement database operations
const db = null;

router.get(
  "/",
  middleware.authGuard,
  middleware.checkCarIdExist,
  async (req, res, next) => {
    try {
      const { car_id, page = 0 } = req.query;
      if (!Number.isInteger(Number(page)) || page < 0) {
        return res.status(400).json({
          error: "Invalid Input",
          message: "Page must be a positive integer",
        });
      }
      // TODO: Fetch reviews for the car with pagination
      const reviews = await db.getReviewsByCarId(car_id, page);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  middleware.authGuard,
  middleware.checkCarIdExist,
  middleware.checkUserExists,
  middleware.validateReviewForm,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { car_id, grade, content } = req.body;
      // TODO: Validate input and create review
      const review = await db.createReview(userId, car_id, grade, content);
      res
        .status(201)
        .json({ message: "Review created successfully", id: review.id });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  middleware.authGuard,
  middleware.checkReviewExists,
  async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      const { action } = req.body;
      // TODO: Update review likes/dislikes
      const updatedReview = await db.updateReviewLikesDislikes(
        reviewId,
        action,
      );
      res.status(201).json(updatedReview);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  middleware.authGuard,
  middleware.checkReviewExists,
  async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      // TODO: Delete review by ID
      const deleted = await db.deleteReview(reviewId);
      if (!deleted) {
        return res
          .status(400)
          .json({ error: "Invalid Input", message: "Invalid review id" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
