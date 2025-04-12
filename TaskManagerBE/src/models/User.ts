import mongoose, { Schema, Document } from "mongoose";
import { ROLES } from "../utils/enums";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(ROLES) },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
