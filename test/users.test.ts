// getUsersById.test.ts

import {Request, Response} from "express";
import {getUsersById} from "../src/controllers/users";

describe("getUsersById", () => {
  it("should return a user when a valid ID is provided", () => {
    const mockReq = {params: {id: "1"}} as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    getUsersById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({msg: expect.anything()}); // Assuming your user object has a 'msg' property
  });

  it("should return a 400 status when an invalid ID is provided", () => {
    const mockReq = {
      params: {id: "idf54"},
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    getUsersById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({msg: "Invalid Params"});
    expect(mockRes.send).not.toHaveBeenCalledTimes(2);
  });

  it("should return a 404 status when no user is found", () => {
    const mockReq = {
      params: {id: "999"},
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    getUsersById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith({msg: "No user found"});
  });
});

/** The code */
// Assuming your function is defined in a file called 'userController.js'

const {createUser} = require("../src/controllers/users");

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
});
