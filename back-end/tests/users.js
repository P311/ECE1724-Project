
const app = require("../src/server");
const middleware = require("../src/middleware");
const jwt = require("jsonwebtoken");
const request = require("supertest"); // used for sending mock requests
const utils  = require("./test_utils");

const mockUser = {
  username: "testuser",
  email: "testuser@gmail.com",
  password: "Password123!",
};

describe("User Routes", () => {

  beforeEach(async () => {
    await utils.clearAllData();
  });

  describe("POST /register", () => {
    it("should register a user with valid data", async () => {

      const response = await request(app).post("/api/users/register").send(mockUser);

      expect(response.body).toEqual({
        username: mockUser.username,
        email: mockUser.email,
        num_likes: 0,
        id: 1,
      });
      expect(response.status).toBe(201);
    });

    it("should not register a user with duplicate email", async () => {

      await request(app).post("/api/users/register").send(mockUser);

      // send twice
      const response = await request(app).post("/api/users/register").send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toContain("Email is already registered");

      // send with same user name
      const response2 = await request(app).post("/api/users/register").send({...mockUser, email: "new_email@gmail.com"});

      expect(response2.status).toBe(409);
      expect(response2.body).toHaveProperty("error");
      expect(response2.body.message).toContain("Username is already registered");
    });

    it("should return 400 for invalid input", async () => {
      const invalid_names = ["u", "abcAV?", "AY12_3!", "1234567890123456111"];
      for(const name of invalid_names){
        const response = await request(app).post("/api/users/register").send({...mockUser, username: name});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Invalid username");
      }
      const invalid_passwords = [
                "password",
                "PASSWORD",
                "PaSsWoRd",
                "Password1234Password1234Pass",
              ];
      for(const password of invalid_passwords){
        const response = await request(app).post("/api/users/register").send({...mockUser, password: password});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Invalid password");
      }     
      const invalid_emails = [
        "test",
        "test@",
        "test.com",
        "test@com",
        "test.com@com",
        "test@.com",
        "test@com.",
        "test@.com",
      ];
      for(const email of invalid_emails){
        const response = await request(app).post("/api/users/register").send({...mockUser, email: email});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Invalid email");
      }   
    });
  });

  describe("POST /login", () => {

    const credential = {
      email: mockUser.email,
      password: mockUser.password
    }

    beforeEach(async () => {
      jest.clearAllMocks(); // clean
      await utils.clearAllData();
      //register the mock user
      await request(app).post("/api/users/register").send(mockUser);
    });

    it("should login a user with valid credentials", async () => {
      const response = await request(app).post("/api/users/login").send(credential);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toEqual({
        id: 1,
        username: mockUser.username,
        email: mockUser.email,
        num_likes: 0
      });
    });

    it("should return 401 for invalid credentials", async () => {

      const response = await request(app).post("/api/users/login").send({...credential, password: "Akihabara"});

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid email or password");
    });

    it("should return 401 when accessing other routes without login", async() => {
      const response = await request(app).get("/api/cars").send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Unauthorized");
    })
  });
});

