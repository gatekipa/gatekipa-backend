import mongoose from "mongoose";

interface ICompany {
  name: string;
  emailAddress: string;
  mobileNo: string;
  isSubscriptionActive: boolean;
  nextPaymentDate: Date;
  stripeCustomerId: string;
  lastPaymentDate: Date;
  companyCode: string;
  address: string;
}

const companySchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    isSubscriptionActive: {
      type: Boolean,
      required: true,
    },
    nextPaymentDate: {
      type: Date,
      required: true,
    },
    lastPaymentDate: {
      type: Date,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    companyCode: {
      type: String,
      required: true,
    },
    address: {
      required: true,
      type: String,
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

const Company = mongoose.model<ICompany>("company", companySchema, "company");

export { Company };
