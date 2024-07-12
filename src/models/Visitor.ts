import mongoose from "mongoose";

interface IVisitor {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNo: string;
  isActive: boolean;
  companyId: string;
  createdBy: string;
}

const visitorSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    companyId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    createdBy: {
      required: true,
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

const Visitor = mongoose.model<IVisitor>("visitor", visitorSchema, "visitor");

export { Visitor };
