import express, {Request, Response, NextFunction, Router} from "express";
import {users} from "../index";

const router = Router();

router.get("/api/users/:id", (req: Request, res: Response) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Invalid Params"});

  const user = users.find((user) => user.id === parseId);
  if (!user) return res.status(404).send({msg: "No user found"});
  return res.status(200).send({msg: user});
});

export default router;
