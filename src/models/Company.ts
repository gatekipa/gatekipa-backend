import mongoose from "mongoose";

interface ICompany {
  name: string;
  ownerFirstName: string;
  ownerLastName: string;
  emailAddress: string;
  mobileNo: string;
  isSubscriptionActive: boolean;
  nextPaymentDate: Date | null;
  stripeCustomerId: string;
  lastPaymentDate: Date | null;
  companyCode: string;
  address: string;
  companyPlanSubscription: string;
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
    ownerFirstName: {
      type: String,
      required: true,
    },
    ownerLastName: {
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
      required: false,
    },
    lastPaymentDate: {
      type: Date,
      required: false,
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
    companyPlanSubscription: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "companyPlanSubscription",
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
