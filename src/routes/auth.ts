import {Request, Response, NextFunction, Router} from "express";
import {users} from "../db/users";
import passport from "passport";
// import "../strategies/localStrategy";
import "../strategies/localStrategy2";
import "../strategies/googleStrategy";

const router = Router();

// user signin on localdb using passport
router.post(
  "/api/auth/login",
  passport.authenticate("local"), //using localstrategy
  (req: any, res: Response) => {
    res.status(201).send({msg: "successfully log in"});
  }
);

// Mongodb signin with passport
router.post(
  "/api/auth/v1/login",
  passport.authenticate("local"), //using localstrategy2
  (req: any, res: Response) => {
    res.status(201).send({msg: "successfully log in"});
  }
);

//Signin with google
router.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

// Localdb signin without passport
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

// Get passport user any user
router.get("/api/auth", (req: Request, res: Response) => {
  console.log(req.session);
  if (!req.user)
    return res.status(200).send({msg: "Sign in or create an account"});
  return res.status(200).send({msg: req.user});
});

// get user without passport
router.get("/api/v1/auth/", (req: any, res: Response) => {
  if (!req.session.user) {
    return res.status(200).send({msg: "Not unauthenticated"});
  }
  return res.status(200).send({msg: req.session.user});
});

// Passport logout
router.get("/api/auth/logout", (req: Request, res: Response) => {
  if (!req.user) return res.status(401).send({msg: "not signed in"});
  req.logOut((error) => {
    if (error) return res.status(401).send({msg: "not signed in"});
    return res.status(200).send({msg: "logged out"});
  });
});

export default router;
