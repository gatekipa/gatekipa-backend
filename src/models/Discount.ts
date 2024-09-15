import mongoose, { ObjectId } from "mongoose";

interface IDiscount {
  code: string;
  maxNoUsage: number;
  discountType: "FLAT" | "PERCENTAGE";
  discountValue: number;
  isActive: boolean;
  expiryDate: Date;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
}

const discountSchema = new mongoose.Schema(
  {
    code: {
      required: true,
      type: String,
    },
    maxNoUsage: {
      required: true,
      type: Number,
    },
    discountType: {
      required: true,
      type: String,
    },
    discountValue: {
      required: true,
      type: Number,
    },
    isActive: {
      required: true,
      type: Boolean,
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

const Discount = mongoose.model<IDiscount>(
  "discounts",
  discountSchema,
  "discounts"
);

export { Discount };
