import {hashPassword} from "../src/utils/helper";
import {matchedData} from "express-validator";
import * as validator from "express-validator";
import {expect, jest, test} from "@jest/globals";

const {user} = require("../src/db/schemas/usersSchema");
const {createUser} = require("../src/controllers/users");

// Mock Vlaidator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => true),
    array: jest.fn(() => [{msg: "Invalid Field"}]),
  })),

  //  Match data function
  matchedData: jest.fn(() => ({
    username: "testuser",
    password: "password",
    displayName: "testname",
  })),
}));

//Hash Password function
jest.mock("../src/utils/helper", () => {
  return {hashPassword: jest.fn((password) => "hashedpassword")};
});

// Database mock
jest.mock("../src/db/schemas/usersSchema");

describe("createUser", () => {
  it("should send status of 201 when a new user is created", async () => {
    // jest
    //   .spyOn(validator, "validationResult")
    //   .mockImplementationOnce(() => ({isEmpty: jest.fn(() => true)}));
    console.log(user.mock);

    const savedMethod = jest
      .spyOn(user.prototype, "save")
      .mockResolvedValueOnce({
        id: 1,
        username: "testuser",
        // email: "test@example.com",
        displayName: "testname",
        password: "hashedpassword",
      });
    const req = {
      body: {
        username: "testuser",
        // email: "test@example.com",
        displayName: "testname",
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
    expect(hashPassword).toHaveReturnedWith("hashedpassword");
    //  User was called with matched data not req.body
    expect(user).toHaveBeenCalledWith({
      username: "testuser",
      displayName: "testname",
      password: "hashedpassword",
    });

    expect(savedMethod).toHaveBeenCalled(); //save method was called
    expect(user.mock.instances[0].save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        username: "testuser",
        displayName: "testname",
      })
    );
  });

  it("should send status of 400 when database fails to save", async () => {
    // jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
    //   isEmpty: jest.fn(() => false),
    //   array: jest.fn(() => [{}]),
    // }));

    const req = {
      body: {
        username: "testuser",
        displayName: "testname",
        password: "testpassword",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const savedMethod = jest
      .spyOn(user.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));
    // Call the function
    await createUser(req, res);
    expect(savedMethod).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
