import mongoose, { ObjectId } from "mongoose";

interface IFeature {
  title: string;
  details: string[];
}
interface IPlan {
  planName: string;
  price: number;
  subscriptionType: "MONTHLY" | "YEARLY";
  description: string;
  isActive: boolean;
  features: IFeature[];
  createdBy: ObjectId;
  updatedBy?: ObjectId;
}

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    subscriptionType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    features: {
      type: Array,
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

const Plan = mongoose.model<IPlan>("plan", planSchema, "plan");

export { Plan };
