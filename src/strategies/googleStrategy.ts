import passport from "passport";
import {Strategy} from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/auth/google/callback",
      // scope: ["identify"],
    },
    // there is no password, check if user dey, if user no dey create user
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }
  )
);
