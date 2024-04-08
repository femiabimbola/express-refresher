import express, {Request, Response, NextFunction, Router} from "express";

import {users} from "../db/users";

export const resolveUserById = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId))
    return res.status(400).send({msg: "Bad request! Invalid ID"});

  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

  req.findUserIndex = findUserIndex;
  next();
};
