// import {describe} from "@jest/globim
import {Request, Response, NextFunction, Router} from "express";

import {getUsersById} from "../src/controllers/users";

const mockRequest: any = {
  params: 1,
};
const mockResponse: any = {
  send: jest.fn(),
  status: jest.fn(),
};
describe("Users function", () => {
  it("It should get user", () => {
    getUsersById(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
