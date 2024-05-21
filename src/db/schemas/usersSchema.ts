import mongoose, {Schema, model} from "mongoose";

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  displayName: {type: String, required: true, maxlength: 15},
  password: {type: String, required: true},
});

export const User = model("user", UserSchema);

// const UsernOTSchema = new mongoose.Schema({
//   username: {type:mongoose.Schema.Types.String}
// })
