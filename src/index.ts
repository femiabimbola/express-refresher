import express, {Request, Response} from "express";
import session from "express-session";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "the supposed secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

const PORT = process.env.PORT || 8000;

app.get("/", (req: any, res: Response) => {
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("hello", "world", {maxAge: 6000 * 600});

  res.status(200).send({msg: "Express with a TypeScript Server"});
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
