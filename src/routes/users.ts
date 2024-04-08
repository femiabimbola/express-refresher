import {Request, Response, NextFunction, Router} from "express";
import {users} from "../db/users";

import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {createUserValidationSchema} from "../validationSchema";
import {resolveUserById} from "../middleware/users";

const router = Router();

router.get("/api/users/:id", (req: Request, res: Response) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Invalid Params"});

  const user = users.find((user) => user.id === parseId);
  if (!user) return res.status(404).send({msg: "No user found"});
  return res.status(200).send({msg: user});
});

router.get(
  "/api/users",
  query("filter")
    .notEmpty()
    .withMessage("Should not be empty")
    .isLength({min: 3, max: 10})
    .withMessage("min of 3 letter"),
  (req: any, res: Response) => {
    const {filter, value} = req.query;

    if (filter && value) {
      return res
        .status(200)
        .send(users.filter((user: any) => user[filter].includes(value)));
    }
    return res.status(200).send(users);
  }
);

router.post(
  "/api/users/",
  checkSchema(createUserValidationSchema),
  (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({error: result.array().map((err) => err)});
    }
    const {body} = req;
    const data = matchedData(req);
    const newUser = {id: users[users.length - 1].id + 1, ...body};
    users.push(...users, newUser);
    return res.status(201).send({msg: users});
  }
);

// PUT query
router.put("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {body, findUserIndex} = req;
  users[findUserIndex] = {id: users[findUserIndex].id, ...body};
  return res.status(200).send({msg: "user updated"});
});

// Patch query
router.patch("/api/users/:id", (req: Request, res: Response) => {
  const {body} = req;
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Bad request"});

  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

  users[findUserIndex] = {...users[findUserIndex], ...body};

  return res.status(201).send({msg: "user updated"});
});

// the delete
router.delete("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {findUserIndex} = req;
  users.splice(findUserIndex, 1);

  return res.status(200).send({msg: "user removed"});
});

export default router;
