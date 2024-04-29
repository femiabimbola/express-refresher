import passport from "passport";
import {Strategy} from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_ID as string,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    () => {}
  )
);
