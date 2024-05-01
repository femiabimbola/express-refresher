import passport from "passport";
import {Strategy} from "passport-google-oauth20";
import dotenv from "dotenv";
import {GoogleUser} from "../db/schemas/googleSchema.";

dotenv.config();

/**  The done function in passport use calls it
 * Put user.id in the session id because it is unique
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/** Go into the session store, looks for the sessionid
 * Looks for the user that owns the session
 * and parse the user into a json object and attaches it
 * req.user
 * The first params follows the serialized user field
 */
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await GoogleUser.findById(id);
    if (!findUser) return done(null, null);
    // if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (error) {
    done(error, false);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      // scope: ["identify"],
    },

    // there is no password, check if user dey, if user no dey create user
    async (accessToken, refreshToken, profile, done: any) => {
      let findUser;
      try {
        findUser = await GoogleUser.findOne({googleId: profile.id});
      } catch (error) {
        return done(error, null);
      }
      try {
        if (!findUser) {
          const newUser = new GoogleUser({
            username: profile.displayName,
            googleId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
