import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";

import cors, { CorsOptions } from "cors";
import { listCompanyRouter } from "./routes/company/list-company";
import { changePasswordRouter } from "./routes/auth/change-password";
import { forgotPasswordRouter } from "./routes/auth/forgot-password";
import { newPasswordRouter } from "./routes/auth/new-password";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { verifyForgotPasswordTokenRouter } from "./routes/auth/verify-forgot-pass-token";
import { checkInVisitRouter } from "./routes/visitor/check-in";
import { checkOutVisitRouter } from "./routes/visitor/check-out";
import { createVisitRouter } from "./routes/visitor/create-visit";
import { createVisitorRouter } from "./routes/visitor/create-visitor";
import { listVisitsRouter } from "./routes/visitor/list-visit";
import { listVisitorRouter } from "./routes/visitor/list-visitor";
import { listEmployeeRouter } from "./routes/employee/list-employee";

const dotenv = require("dotenv").config();

const app = express();

app.use(cookieParser());

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "development",
    name: "gatekipa-app-session",
    httpOnly: true,
    sameSite: "none",
  })
);

const corsOptions: CorsOptions = {
  origin: `${process.env.ALLOWED_FRONTEND_ORIGIN}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// app.post(`/company`, (req, res) => {
//   const company = new Company({
//     ...req.body,
//     nextPaymentDate: new Date(),
//     lastPaymentDate: new Date(),
//   });
//   company.save();
//   res.status(201).send(company);
// });

app.use(signupRouter);
app.use(listCompanyRouter);
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
app.use(listEmployeeRouter);

app.use("/", (req, res) => {
  res.send("GateKipa Backend API");
});

app.all("*", (req, res, next) => {
  throw new Error("Route not found");
});

//app.use(globalErrorMiddleware);

export { app };
