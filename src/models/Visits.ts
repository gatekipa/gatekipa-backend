import mongoose from "mongoose";

interface IVisits {
  visitorId: string;
  purposeOfVisit: string;
  personToMeet: string;
  personToMeetEmail: string;
  personToMeetMobileNo: string;
  employeeId?: string;
  checkInTime?: Date;
  checkoutTime?: Date;
  createdBy: string;
  updatedBy?: string;
}

const visitSchema = new mongoose.Schema(
  {
    visitorId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitor",
    },
    employeeId: {
      required: false,
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
    personToMeet: {
      type: String,
      required: false,
    },
    personToMeetMobileNo: {
      type: String,
      required: false,
    },
    personToMeetEmail: {
      type: String,
      required: false,
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
