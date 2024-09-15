import mongoose, { ObjectId } from "mongoose";

interface IDiscountEmail {
  discount: ObjectId;
  emailAddress: string;
  isEmailSent: boolean;
  emailSentDate?: Date;
}

const discountEmailSchema = new mongoose.Schema(
  {
    discount: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "discounts",
    },
    emailAddress: {
      required: true,
      type: String,
    },
    isEmailSent: {
      required: true,
      type: Boolean,
    },
    emailSentDate: {
      required: false,
      type: Date,
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

const DiscountEmail = mongoose.model<IDiscountEmail>(
  "discountEmails",
  discountEmailSchema,
  "discountEmails"
);

export { DiscountEmail };
