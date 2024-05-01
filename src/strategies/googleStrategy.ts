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
      let findUser;
      try {
        findUser = await GoogleUser.findOne({googleId: profile.id});
      } catch (error) {}
      console.log(profile);

      if (!findUser) {
        const newUser = new GoogleUser({
          username: profile.username,
          googleId: profile.id,
        });
        const newSavedUser = await newUser.save();
        done(null, newSavedUser);
      }
    }
  )
);
