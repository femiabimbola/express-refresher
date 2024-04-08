import express, {Request, Response} from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.cookie("firstCo", "rubbuished", {maxAge: 2000 * 5});
  res.status(200).send({msg: "Express with a TypeScript Server"});
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
