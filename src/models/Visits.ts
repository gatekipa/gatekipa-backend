import mongoose from "mongoose";

interface IVisits {
  visitor: string;
  purposeOfVisit: string;
  employee?: string;
  checkInTime?: Date;
  checkoutTime?: Date;
  createdBy: string;
  updatedBy?: string;
}

const visitSchema = new mongoose.Schema(
  {
    visitor: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitor",
    },
    employee: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    purposeOfVisit: {
      type: String,
      required: false,
    },
    visitDate: {
      type: Date,
    },
    checkInTime: {
      type: Date,
      required: false,
    },
    checkoutTime: {
      type: Date,
      required: false,
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

const Visits = mongoose.model<IVisits>("visits", visitSchema, "visits");

export { Visits };
