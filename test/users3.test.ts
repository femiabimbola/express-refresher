import {hashPassword} from "../src/utils/helper";
import {matchedData} from "express-validator";
import * as validator from "express-validator";

const {createUser} = require("../src/controllers/users");

jest.mock("../src/utils/helper", () => {
  return {hashPassword: jest.fn((password) => "hashedpassword")};
});

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
}));

// const mockRequest = {
//   findUserIndex: 1,
// };

describe("createUser", () => {
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
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(hashPassword).toHaveBeenCalledWith("password");
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

  it("should handle validation errors", async () => {
    // Mock request and response objects with validation error
    const req = {
      body: {
        // Provide invalid data to trigger validation error
        // For example:
        username: "invaliduser",
        email: "invalidemail",
        password: "short",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function
    await createUser(req, res);

    // Check if the appropriate status and response were sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      expect.arrayContaining([
        // Check if the validation error array contains expected error messages
        // For example:
        {msg: "Invalid email address"},
        {msg: "Password must be at least 6 characters long"},
      ])
    );
  });

  it("should handle other errors", async () => {
    // Mock request and response objects to simulate other error
    const req = {
      body: {
        // Provide valid data
        // For example:
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Simulate an error during user creation
    const error = new Error("Some error occurred");
    createUser.mockImplementationOnce(() => {
      throw error;
    });

    // Call the function
    await createUser(req, res);

    // Check if the appropriate status and response were sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(error);
  });

  it("should return status of 201 and create a new user", async () => {
    // jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
    //   isEmpty: jest.fn(() => true),
    // }));

    const req: any = {
      body: {
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
    expect(hashPassword).toHaveBeenCalled();
    expect(validator.matchedData).toHaveBeenCalledWith(req);
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