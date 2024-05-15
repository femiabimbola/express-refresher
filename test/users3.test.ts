import {hashPassword} from "../src/utils/helper";
import {matchedData} from "express-validator";
import * as validator from "express-validator";
// import {user} from "../src/db/schemas/usersSchema";
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

jest.mock("../src/db/schemas/usersSchema", () => {
  return {
    user: jest.fn((matchedData) => {
      "some object";
    }),
  };
});

describe("createUser", () => {
  it("should create a new user", async () => {
    // jest
    //   .spyOn(validator, "validationResult")
    //   .mockImplementationOnce(() => ({isEmpty: jest.fn(() => true)}));
    console.log(user.mock);

    // const savedMethod = jest
    //   .spyOn(user.prototype, "save")
    //   .mockResolvedValueOnce({
    //     id: 1,
    //     username: "testuser",
    //     email: "test@example.com",
    //     password: "hashedpassword",
    //   });
    const req = {
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
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(hashPassword).toHaveReturnedWith("hashedpassword");
    //  User was called with matched data not req.body
    expect(user).toHaveBeenCalledWith({
      username: "testuser",
      displayName: "testname",
      password: "hashedpassword",
    });

    // expect(savedMethod).toHaveBeenCalled();
    // expect(user.mock.instances[0].save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201);
    //   expect(res.send).toHaveBeenCalledWith({
    //       username: "testuser",
    //       email: "test@example.com",
    //   });
  });
});
