import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile:{type:String , required:false}
}); 

export const User = mongoose.model("User", UserSchema);
