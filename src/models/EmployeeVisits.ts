import mongoose from "mongoose";

interface IEmployeeVisit {
  checkInTime?: Date;
  checkOutTime?: Date;
  employee: string;
  createdBy: string;
  updatedBy?: string;
}

const employeeVisitSchema = new mongoose.Schema(
  {
    checkOutTime: {
      type: Date,
      required: false,
    },
    checkInTime: {
      type: Date,
      required: false,
    },
    employee: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
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

const EmployeeVisit = mongoose.model<IEmployeeVisit>(
  "employeeVisit",
  employeeVisitSchema,
  "employeeVisit"
);

export { EmployeeVisit };
