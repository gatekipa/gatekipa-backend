import mongoose, { ObjectId } from "mongoose";

interface IInvoice {
  invoiceNo: string;
  amount: number;
  discountedAmount: number;
  invoiceStatus: "UNPAID" | "PAID" | "CANCELLED" | "OVERDUE";
  payment?: ObjectId;
  company: ObjectId;
  invoiceDate: Date;
}

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    invoiceStatus: {
      type: String,
      required: true,
    },
    discountedAmount: {
      type: Number,
      required: true,
    },
    payment: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
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

const Invoice = mongoose.model<IInvoice>("invoice", invoiceSchema, "invoice");

export { Invoice };
