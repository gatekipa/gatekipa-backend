import mongoose from "mongoose";

interface IEmployee {
  firstName: string;
  lastName: string;
  employeeNo: string;
  dateOfBirth: Date;
  emailAddress: string;
  designation: string;
  shift: string;
  mobileNo: string;
  isActive: boolean;
  payrollPeriodEndDate: Date;
  timesheetDueDate: Date;
  payDate: Date;
  companyId: string;
  createdBy: string;
  updatedBy?: string;
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
    payrollPeriodEndDate: {
      type: Date,
      required: true,
    },
    timesheetDueDate: {
      type: Date,
      required: true,
    },
    payDate: {
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
    shift: {
      required: false,
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
    updatedBy: {
      required: false,
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
