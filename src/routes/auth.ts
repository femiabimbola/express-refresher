import {Request, Response, NextFunction, Router} from "express";
import {users} from "../db/users";

const router = Router();

router.post("/api/auth/", (req: Request, res: Response) => {
  const {password, display} = req.body;
  const findUser = users.find((user) => user.display === display);
  if (!findUser) return res.status(401).send({msg: "Credential not found"});
  if (findUser.password === password)
    return res.status(401).send({msg: "Password not correct"});
});

export default router;
