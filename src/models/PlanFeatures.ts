import mongoose, { ObjectId } from "mongoose";
import { IAssignedFeature } from "../dto/plan/assigned-feature.interface";

interface IPlanFeature {
  plan: ObjectId;
  assignedFeatures: IAssignedFeature[];
  createdBy: ObjectId;
  updatedBy?: ObjectId;
}

const planFeatureSchema = new mongoose.Schema(
  {
    plan: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    assignedFeatures: {
      required: true,
      type: Array,
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

const PlanFeatures = mongoose.model<IPlanFeature>(
  "planFeatures",
  planFeatureSchema,
  "planFeatures"
);

export { PlanFeatures };
