import {Request, Response, NextFunction, Router} from "express";
import {mockUsers} from "../db/users";
import {user} from "../db/schemas/usersSchema";

import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  createUserValidationSchema2,
} from "../validationSchema";
import {resolveUserById} from "../middleware/users";
import {hashPassword} from "../utils/helper";
import {getUsersById} from "../controllers/users";

const router = Router();

router.get("/api/users/:id", getUsersById);

router.get(
  "/api/users",
  query("filter")
    .notEmpty()
    .withMessage("Should not be empty")
    .isLength({min: 3, max: 10})
    .withMessage("min of 3 letter"),
  (req: any, res: Response) => {
    const result = validationResult(req);
    console.log(result);
    const {filter, value} = req.query;
    req.sessionStore.get(req.session.id, (err: any, sessionData: any) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(`${sessionData} ---> session store`);
    });

    if (filter && value) {
      return res
        .status(200)
        .send(mockUsers.filter((user: any) => user[filter].includes(value)));
    }
    return res.status(200).send(mockUsers);
  }
);

// the localdb
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
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(...mockUsers, newUser);
    return res.status(201).send({msg: mockUsers});
  }
);

// create user in mongodb
router.post(
  "/api/v1/users/",
  checkSchema(createUserValidationSchema2),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const {body} = req;
    const data = matchedData(req);
    console.log(data);
    data.password = await hashPassword(data.password);
    console.log(data);
    const newUser = new user(data); // creating the user
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

// PUT query
router.put("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {body, findUserIndex} = req;
  mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body};
  return res.status(200).send({msg: "user updated"});
});

// Patch query
router.patch("/api/users/:id", (req: Request, res: Response) => {
  const {body} = req;
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Bad request"});

  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

  mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};

  return res.status(201).send({msg: "user updated"});
});

// the delete
router.delete("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {findUserIndex} = req;
  mockUsers.splice(findUserIndex, 1);

  return res.status(200).send({msg: "user removed"});
});

export default router;
