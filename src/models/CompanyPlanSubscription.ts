import mongoose from "mongoose";

interface ICompanyPlanSubscription {
  plan: string;
  company: string;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  createdBy: string;
  updatedBy?: string;
}

const companyPlanSubscriptionSchema = new mongoose.Schema(
  {
    company: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    plan: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    status: {
      type: String,
      required: true,
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

const CompanyPlanSubscription = mongoose.model<ICompanyPlanSubscription>(
  "companyPlanSubscription",
  companyPlanSubscriptionSchema,
  "companyPlanSubscription"
);

export { CompanyPlanSubscription };
