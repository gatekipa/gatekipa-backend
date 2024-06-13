import mongoose from "mongoose";

interface ITodo {
  name: string;
  description: string;
  dueDate: Date;
}

const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
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

const Todo = mongoose.model<ITodo>("todo", todoSchema, "todo");

export { Todo };
