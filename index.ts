import mongoose from "mongoose";
import { app } from "./src/app";

const PORT = 3001;
const start = async () => {
  //Test comment
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database successfully!");
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Gatekipa backend listening on ${PORT}!`);
  });
};

start();
