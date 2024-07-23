import mongoose, { Document, Schema } from "mongoose";

interface ICompanyCounter extends Document {
  companyId: string;
  seq: number;
}

const CompanyCounterSchema: Schema = new Schema({
  companyId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    unique: true,
  },
  seq: { type: Number, default: 100000 },
});

const CompanyCounter = mongoose.model<ICompanyCounter>(
  "companyCounter",
  CompanyCounterSchema
);

export { CompanyCounter, ICompanyCounter };
