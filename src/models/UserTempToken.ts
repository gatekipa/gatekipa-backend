import { EventType, DomainType } from "../common/enums";
import mongoose from "mongoose";

interface IUserTempToken {
  domain: string;
  token: string;
  isVerified: Boolean;
  expiryDate: Date;
  eventType: EventType;
  domainType: DomainType;
}

const userTempTokenSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    domainType: {
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
        delete ret.__v;
      },
    },
  }
);

const UserTempToken = mongoose.model<IUserTempToken>(
  "userTempToken",
  userTempTokenSchema,
  "userTempToken"
);

export { UserTempToken };
