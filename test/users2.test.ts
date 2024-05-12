import * as validator from "express-validator";
const {createUser} = require("../src/controllers/users");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{msg: "Invalid Field"}]),
  })),
}));

describe("create users", () => {
  const mockRequest = {
    body: {
      // Provide necessary data for creating a user
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    },
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  it("shoud send status of 400 when there are error with validation", async () => {
    await createUser(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenLastCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{msg: "Invalid Field"}]);
  });
});
