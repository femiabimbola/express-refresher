import passport from "passport";
import {Strategy} from "passport-local";
import {users} from "../db/users";

passport.serializeUser((user: any, done) => {
  console.log(`inside serialize user ${user}`);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`inside deserialize user ${id}`);
  try {
    const findUser = users.find((user) => user.id === id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (error) {
    done(error, false);
  }
});

const authUser = (username: string, password: string, done: any) => {
  try {
    const findUser = users.find((user) => user.name === username);
    if (!findUser) throw new Error("user not found");
    if (findUser.password !== password)
      throw new Error("Password does not match");
    done(null, findUser);
  } catch (err) {
    done(err, false);
  }
};

export default passport.use(new Strategy({usernameField: "name"}, authUser));

// export default passport.use(
//   new Strategy({usernameField: "name"}, (username, password, done) => {
//     console.log(`${username}`);
//     console.log(`${password}`);
//     try {
//       const findUser = users.find((user) => user.name === username);
//       if (!findUser) throw new Error("user not found");
//       if (findUser.password !== password)
//         throw new Error("Password does not match");
//       done(null, findUser);
//     } catch (err) {
//       done(err, false);
//     }
//   })
// );
