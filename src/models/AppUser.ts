import mongoose from "mongoose";

const userTypeValue = ["VISITOR", "EMPLOYEE", "ADMIN"];
interface IAppUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNo: string;
  isActive: boolean;
  isLoggedIn: boolean;
  userType: string;
  password: string;
  employeeId?: string;
  companyId: string;
  visitorId?: string;
  isEmailVerified: boolean;
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNo: {
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
    isEmailVerified: {
      type: Boolean,
      required: true,
    },
    userType: {
      type: String,
      enum: userTypeValue,
      required: true,
    },
    employeeId: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    companyId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    visitorId: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitor",
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
