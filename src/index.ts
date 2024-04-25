import express, {Request, Response} from "express";
import session from "express-session";
import routes from "./routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import MongoStore from "connect-mongo";
import connectToDB from "./config/db";
import mongoose from "mongoose";

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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 8000;

connectToDB();

app.get("/", (req: any, res: Response) => {
  req.session.visited = true;
  res.cookie("hello", "world", {maxAge: 6000 * 600});

  res.status(200).send({msg: "Express with a TypeScript Server"});
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
