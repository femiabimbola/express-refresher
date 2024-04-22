import passport from "passport";
import {Strategy} from "passport-local";
import {users} from "../db/users";
import {user} from "../db/schemas/usersSchema";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await user.findById(id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (error) {
    done(error, false);
  }
});

const authUser = async (username: string, password: string, done: any) => {
  try {
    const findUser = await user.findOne({username});
    if (!findUser) throw new Error("User not found");
    if (findUser.password !== password) throw new Error("Password not correct");
    done(null, findUser);
  } catch (err) {
    done(err, false);
  }
};

export default passport.use(new Strategy(authUser));