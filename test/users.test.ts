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
