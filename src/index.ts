import express, {Request, Response} from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({msg: "Express with a TypeScript Server"});
});

const users = [
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
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send({msg: "Invalid Params"});

  const user = users.find((user) => user.id === parseId);
  if (!user) return res.status(404).send({msg: "No user found"});
  return res.status(200).send({msg: user});
});

// Query
app.get("/api/users", (req: Request, res: Response) => {
  const {
    query: {filter, value},
  } = req;
  if (!filter && !value) return res.status(200).send(users);
  res.status(200).send(users);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
