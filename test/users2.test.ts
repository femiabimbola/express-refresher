import {genSaltSync, hashSync} from "bcrypt";
import validator from "express-validator";
// import {createUser} from "../src/controllers/users";
const {createUser} = require("../src/controllers/users");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{msg: "Invalid Field"}]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "testname",
  })),

  hashPassword: jest.fn(() => ({
    genSaltSync: jest.fn(() => "sometest"),
    hashSync: jest.fn(() => "hashedthefreakedpassword"),
  })),
}));

// const mockRequest = {
//   findUserIndex: 1,
// };

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};

describe("create users", () => {
  const mockRequest = {
    body: {
      // Provide necessary data for creating a user
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    },
  };

  it("shoud send status of 400 when there are error with validation", async () => {
    await createUser(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenLastCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{msg: "Invalid Field"}]);
  });

  it("should create a new user", async () => {
    // Mock request and response objects
    const req = {
      body: {
        // Provide necessary data for creating a user
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function
    await createUser(req, res);

    // Check if the appropriate status and response were sent
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        // Check if the saved user object has the expected properties
        // For example:
        username: "testuser",
        email: "test@example.com",
      })
    );
  });
});
