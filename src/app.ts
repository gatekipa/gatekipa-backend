import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { changePasswordRouter } from "./routes/auth/change-password";
import { forgotPasswordRouter } from "./routes/auth/forgot-password";
import { verifyForgotPasswordTokenRouter } from "./routes/auth/verify-forgot-pass-token";
import { newPasswordRouter } from "./routes/auth/new-password";
import cors, { CorsOptions } from "cors";
import { Company } from "./models/Company";
import { listVisitorRouter } from "./routes/visitor/list-visitor";
import { createVisitorRouter } from "./routes/visitor/create-visitor";
import { listVisitsRouter } from "./routes/visitor/list-visit";
import { createVisitRouter } from "./routes/visitor/create-visit";
import { checkInVisitRouter } from "./routes/visitor/check-in";
import { checkOutVisitRouter } from "./routes/visitor/check-out";

const dotenv = require("dotenv").config();

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "development",
    name: "gatekipa-app-session",
  })
);

const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_FRONTEND_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get(`/company`, async (req, res) => {
  const companies = await Company.find();
  res.status(200).json(companies);
});

app.post(`/company`, (req, res) => {
  const company = new Company({
    ...req.body,
    nextPaymentDate: new Date(),
    lastPaymentDate: new Date(),
  });
  company.save();
  res.status(201).send(company);
});

app.use(signupRouter);
app.use(signinRouter);
app.use(changePasswordRouter);
app.use(signoutRouter);
app.use(forgotPasswordRouter);
app.use(verifyForgotPasswordTokenRouter);
app.use(newPasswordRouter);
app.use(listVisitorRouter);
app.use(createVisitorRouter);
app.use(listVisitsRouter);
app.use(createVisitRouter);
app.use(checkInVisitRouter);
app.use(checkOutVisitRouter);

app.all("*", async (req, res, next) => {
  throw new Error("Route not found");
});

//app.use(globalErrorMiddleware);

export { app };
