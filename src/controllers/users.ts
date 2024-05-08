import {Request, Response, NextFunction, Router} from "express";
import {mockUsers} from "../db/users";
import {validationResult, matchedData} from "express-validator";
import {hashPassword} from "../utils/helper";
import {user} from "../db/schemas/usersSchema";

export const getUsersById = (req: Request, res: Response) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Invalid Params"});

  const user = mockUsers.find((user) => user.id === parseId);
  if (!user) return res.status(404).send({msg: "No user found"});
  return res.status(200).send({msg: user});
};

//  Create user in the  mongodb
export const createUser = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  }
  const {body} = req;
  const data = matchedData(req);
  // console.log(data);
  // data.password = await hashPassword(data.password);
  // console.log(data);
  const newUser = new user(data); // creating the user
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (error) {
    return res.status(400).send(error);
  }
};
