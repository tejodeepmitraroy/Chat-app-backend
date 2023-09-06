import { Document, Schema, model } from "mongoose";
import { passwordHashed } from "../config/PasswordHasher/hasher";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified) {
      next();
    }
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password!, salt);
    this.password = await passwordHashed(this.password!);
  } catch (error: any) {
    next(error);
  }
});

// userSchema.methods.matchPassword = async function (enteredPassword: string) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = model<IUser>("User", userSchema);
export default User;
