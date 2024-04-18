import {Request, Response, NextFunction, Router} from "express";
import {users} from "../db/users";
import passport from "passport";
import "../strategies/localStrategy";

const router = Router();

router.post(
  "/api/auth/",
  passport.authenticate("local"),
  (req: any, res: Response) => {
    res.status(201).send({msg: "successfully log in"});
  }
);

router.post("/api/v1/auth/", (req: any, res: Response) => {
  const {password, display} = req.body;
  const findUser = users.find((user) => user.display === display);
  if (!findUser) return res.status(401).send({msg: "Credential not found"});
  if (findUser.password !== password) {
    return res.status(401).send({msg: "Password not correct"});
  }
  req.session.user = findUser;
  console.log(req.session);
  return res.status(200).send({msg: "Loggimg in"});
});

router.get("/api/v1/auth/", (req: any, res: Response) => {
  if (!req.session.user) {
    return res.status(200).send({msg: "Not unauthenticated"});
  }
  return res.status(200).send({msg: req.session.user});
});
export default router;
