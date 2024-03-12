import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express with TypeScript Server");
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))