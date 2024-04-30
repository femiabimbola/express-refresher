import mongoose, {Schema, model} from "mongoose";

const GoogleUserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  googleId: {type: String, required: true, unique: true},
});

export const GoogleUser = model("GoogleUser", GoogleUserSchema);
