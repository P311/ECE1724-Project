const app = require("../src/server");
const middleware = require("../src/middleware");
const jwt = require("jsonwebtoken");


valid_register_info = {
  username: "username",
  password: "Password123",
  email: "test@gmail.com"
}
describe("validateRegisterInfo", () => {
  describe("username", () => {
    it("invalid username", () => {
      const invalid_names = ['u', 'abcAV?', 'AY12_3!', '1234567890123456111'];
      for(const name of invalid_names){
        form = {...valid_register_info, username: name};
        expect(middleware.validateRegisterInfo(form)).toEqual(["Invalid username"]);
      }
    })

    it("valid username", () => {
      const valid_names = ['CHro.m-e', 'xeNo_BlA.de', 'jenshin', '1234567890111'];
      for(const name of valid_names){
        form = {...valid_register_info, username: name};
        expect(middleware.validateRegisterInfo(form)).toEqual([]);
      }
    })
  })

  describe("password", () => {
    it("invalid password", () => {
      const invalid_passwords = ['password', 'PASSWORD', 'PaSsWoRd', 'Password1234Password1234Pass'];
      for(const password of invalid_passwords){
        form = {...valid_register_info, password: password};
        expect(middleware.validateRegisterInfo(form)).toEqual(["Invalid password"]);
      }
    })

    it("valid password", () => {
      const valid_passwords = ['Password123', 'Password1234', 'Password12345'];
      for(const password of valid_passwords){
        form = {...valid_register_info, password: password};
        expect(middleware.validateRegisterInfo(form)).toEqual([]);
      }
    })
  })

  describe("email", () => {
    it("invalid email", () => {
      const invalid_emails = ['test', 'test@', 'test.com', 'test@com', 'test.com@com', 'test@.com', 'test@com.', 'test@.com']
      for(const email of invalid_emails){
        form = {...valid_register_info, email: email};
        expect(middleware.validateRegisterInfo(form)).toEqual(["Invalid email"]);
      }
    })

    it("valid email", () => {
      const valid_emails = ['test@email.com', 'test.l21@mail.utoronto.ca', 'ttt@163.com'];
      for(const email of valid_emails){
        form = {...valid_register_info, email: email};
        expect(middleware.validateRegisterInfo(form)).toEqual([]);
      }
    })
  })
});
describe("authGuard", () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    const mockReq = { headers: {} };

    middleware.authGuard(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    const mockReq = { headers: { authorization: "invalid" } };
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    middleware.authGuard(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should call next if token is valid", () => {
    const mockReq = { headers: { authorization: "valid" } };
    const decodedToken = { id: 1, email: "test@gmail.com" };
    jest.spyOn(jwt, "verify").mockReturnValue(decodedToken);

    middleware.authGuard(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(decodedToken);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});