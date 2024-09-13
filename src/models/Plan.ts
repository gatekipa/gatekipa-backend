import mongoose, { ObjectId } from "mongoose";
import { IPromotionalPricingDto } from "../dto/plan/promotional-pricing.interface";

interface IFeature {
  featureId: ObjectId;
}

interface IPlan {
  planName: string;
  price: number;
  subscriptionType: "MONTHLY" | "YEARLY";
  isPromotionalPlan: boolean;
  promotionalPricing: IPromotionalPricingDto[];
  description: string;
  isActive: boolean;
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
    promotionalPricing: {
      type: Array,
      required: false,
    },
    isPromotionalPlan: {
      type: Boolean,
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
