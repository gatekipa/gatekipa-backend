import mongoose, { ObjectId } from "mongoose";

interface ICompanyAvailedDiscount {
  discount: ObjectId;
  company: ObjectId;
}

const companyAvailedDiscountSchema = new mongoose.Schema(
  {
    discount: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "discounts",
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

const CompanyAvailedDiscount = mongoose.model<ICompanyAvailedDiscount>(
  "companyAvailedDiscounts",
  companyAvailedDiscountSchema,
  "companyAvailedDiscounts"
);

export { CompanyAvailedDiscount };
