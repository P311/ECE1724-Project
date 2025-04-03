const request = require("supertest");
const app = require("../src/server");
const jwt = require("jsonwebtoken");
const utils  = require("./test_utils");


describe("Reviews API", () => {
  const validToken = jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET,
  );

  beforeEach(async () => {
    await utils.clearAllData();
    await utils.insertMockReviews();
  });

  describe("GET /api/reviews/by-car", () => {

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/reviews/by-car");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 with a list of reviews if token is valid", async () => {
      const res = await request(app)
        .get("/api/reviews/by-car?car_id=1")
        .set("Authorization", validToken);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      const res2 = await request(app)
      .get("/api/reviews/by-car?car_id=2")
      .set("Authorization", validToken);
      expect(res2.status).toBe(200);
      // only one page even if there're 20
      expect(res2.body.length).toBe(10);
    });

    it("should return different pages when specified", async () => {
      const res = await request(app)
        .get("/api/reviews/by-car?car_id=2&page=1")
        .set("Authorization", validToken);
      const res2 = await request(app)
      .get("/api/reviews?car_id=2&page=2")
      .set("Authorization", validToken);
      expect(res.body).not.toEqual(res2.body);
    });

  });

  describe("POST /api/reviews", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .send({ car_id: 1, grade: 5, content: "Great car!" });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 201 if review is created successfully", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .set("Authorization", validToken)
        .send({ car_id: 1, grade: 1, content: "Worst car!" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Review created successfully");
    });
  });

  describe("PUT /api/reviews/:id", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .put("/api/reviews/1")
        .send({ action: "like" });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 201 if review is updated successfully", async () => {
      const res = await request(app)
        .put("/api/reviews/1")
        .set("Authorization", validToken)
        .send({ action: "like" });
      expect(res.status).toBe(201);
      expect(res.body.num_likes).toBe(1);
      // same for dislikes
      const res2 = await request(app)
        .put("/api/reviews/1")
        .set("Authorization", validToken)
        .send({ action: "dislike" });
      expect(res2.status).toBe(201);
      expect(res2.body.dislikes).toBe(1);
    });
  });

  describe("DELETE /api/reviews/:id", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).delete("/api/reviews/1");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 204 if review is deleted successfully", async () => {
      const res = await request(app)
        .delete("/api/reviews/1")
        .set("Authorization", validToken);
      expect(res.status).toBe(204);
    });
  });
});
