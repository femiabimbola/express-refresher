import express, {Request, Response} from "express";

import userRouter from "./routes/users";
const app = express();

app.use(express.json());
app.use(userRouter);

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({msg: "Express with a TypeScript Server"});
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
