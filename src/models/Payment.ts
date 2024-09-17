import mongoose, { ObjectId } from "mongoose";

interface IPayment {
  amount: number;
  discount: ObjectId;
  discountedAmount: number;
  stripePaymentIntent: Object;
  company: ObjectId;
}

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "discounts",
    },
    discountedAmount: {
      type: Number,
      required: true,
    },
    stripePaymentIntent: {
      type: Object,
      required: true,
    },
    company: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
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

const Payment = mongoose.model<IPayment>("payment", paymentSchema, "payment");

export { Payment };
