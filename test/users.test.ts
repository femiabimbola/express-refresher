// import {describe} from "@jest/globim
import {Request, Response, NextFunction, Router} from "express";

import {getUsersById} from "../src/controllers/users";

const mockRequest: any = 1;
const mockResponse: any = {};
describe("get users", () => {
  it("It should get user", () => {
    getUsersById(mockRequest, mockResponse);
  });
});
