import mongoose from "mongoose";

interface IAppUser {
  fullName: string;
  emailAddress: string;
  isActive: boolean;
  isLoggedIn: boolean;
  role: string;
  password: string;
}

const appUserSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

const AppUser = mongoose.model<IAppUser>("appUser", appUserSchema, "appUser");

export { AppUser };
