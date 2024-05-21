import passport from "passport";
import {Strategy} from "passport-local";
import {User} from "../db/schemas/usersSchema";
import {comparePassword} from "../utils/helper";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (error) {
    done(error, false);
  }
});

const authUser = async (username: string, password: string, done: any) => {
  try {
    const findUser = await User.findOne({username});
    if (!findUser) throw new Error("User not found");
    if (!comparePassword(password, findUser.password))
      throw new Error("Password not correct");
    done(null, findUser);
  } catch (err) {
    done(err, false);
  }
};

export default passport.use(new Strategy(authUser));
