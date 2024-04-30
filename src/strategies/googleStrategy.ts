import passport from "passport";
import {Strategy} from "passport-google-oauth20";
import dotenv from "dotenv";
import {GoogleUser} from "../db/schemas/googleSchema.";

dotenv.config();

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      // scope: ["identify"],
    },
    // there is no password, check if user dey, if user no dey create user
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const findUser = await GoogleUser.findOne({});
    }
  )
);
