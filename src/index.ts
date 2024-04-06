import express, {Request, Response, NextFunction} from "express";
import {query, validationResult, body, matchedData} from "express-validator";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({msg: "Express with a TypeScript Server"});
});

interface User {
  id: number;
  name: string;
  display: string;
}

const users: User[] = [
  {id: 1, name: "Tush", display: "tushy1"},
  {id: 2, name: "Josh", display: "Josshy"},
  {id: 3, name: "Michael", display: "Mich43"},
  {id: 4, name: "Newman", display: "newman"},
];

// app.get("/api/users", (req: Request, res: Response) => {
//   res.status(200).send(users);
// });

// Params tutorial
app.get("/api/users/:id", (req: Request, res: Response) => {
  // const {params: {id}} = req;

  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Invalid Params"});

  const user = users.find((user) => user.id === parseId);
  if (!user) return res.status(404).send({msg: "No user found"});
  return res.status(200).send({msg: user});
});

// Query
app.get(
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

// Post request
app.post(
  "/api/users/",
  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isLength({min: 3, max: 20})
    .withMessage("name cannot be less than 3"),
  body("display").notEmpty().withMessage("display cannot be empty"),
  (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res
        .status(400)
        .send({error: result.array().map((err) => err.msg)});
    }

    const data = matchedData(req);
    // const {body} = req;
    const {
      body: {name, display},
    } = req;

    // const newUser = {id: users[users.length - 1].id + 1, ...body};
    const newUser = {id: users[users.length - 1].id + 1, name, display};

    users.push(...users, newUser);
    return res.status(201).send({msg: users});
  }
);

// This is a middleware
const resolveUserById = (req: any, res: Response, next: NextFunction) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId))
    return res.status(400).send({msg: "Bad request! Invalid ID"});

  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

  req.findUserIndex = findUserIndex;

  next();
};

// PUT query
app.put("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {body, findUserIndex} = req;

  users[findUserIndex] = {id: users[findUserIndex].id, ...body};
  return res.status(200).send({msg: "user updated"});
});

// Put Query 2 not using middleware
// app.put("/api/users/:id", (req: Request, res: Response) => {
//   const {
//     params: {id},
//   } = req;

//   const {body} = req;
//   const parseId = parseInt(id);
//   if (isNaN(parseId)) return res.status(400).send({msg: "Bad request"});

//   const findUserIndex = users.findIndex((user) => user.id === parseId);
//   if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

//   users[findUserIndex] = {id: parseId, ...body};
//   return res.status(200).send({msg: "done"});
// });

// Patch query
app.patch("/api/users/:id", (req: Request, res: Response) => {
  const {body} = req;
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Bad request"});

  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send({msg: "Not found"});

  users[findUserIndex] = {...users[findUserIndex], ...body};

  return res.status(201).send({msg: "user updated"});
});

// the delete
app.delete("/api/users/:id", resolveUserById, (req: any, res: Response) => {
  const {findUserIndex} = req;
  users.splice(findUserIndex, 1);

  return res.status(200).send({msg: "user removed"});
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
