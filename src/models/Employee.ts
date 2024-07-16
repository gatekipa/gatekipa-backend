import mongoose from "mongoose";

interface IEmployee {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNo: string;
  isActive: boolean;
  companyId: string;
  createdBy: string;
}

const employeeSchema = new mongoose.Schema(
  {
    emailAddress: {
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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    employeeNo: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    shiftId: {
      required: false, // TODO: Add Shifts Collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "shift",
    },
    companyId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    createdBy: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "appUser",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Employee = mongoose.model<IEmployee>(
  "employee",
  employeeSchema,
  "employee"
);

export { Employee };
