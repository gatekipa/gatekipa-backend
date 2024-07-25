import mongoose from "mongoose";

interface IShift {
  name: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  companyId: string;
  createdBy: string;
  updatedBy?: string;
}

const shiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); // Validates HH:MM format
        },
        message: (props: any) =>
          `${props.value} is not a valid time format! Must be HH:MM.`,
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); // Validates HH:MM format
        },
        message: (props: any) =>
          `${props.value} is not a valid time format! Must be HH:MM.`,
      },
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

const Shift = mongoose.model<IShift>("shift", shiftSchema, "shift");

export { Shift };
