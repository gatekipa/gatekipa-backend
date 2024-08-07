import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";

import cors, { CorsOptions } from "cors";
import { listCompanyRouter } from "./routes/company/list-company";
import { createCompanyRouter } from "./routes/company/create-company";
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
import { createEmployeeRouter } from "./routes/employee/create-employee";
import { employeeStatusRouter } from "./routes/employee/employee-status";
import { listShiftRouter } from "./routes/shift/list-shift";
import { createShiftRouter } from "./routes/shift/create-shift";
import { editEmployeeRouter } from "./routes/employee/edit-employee";
import { employeeCheckInRouter } from "./routes/employee/employee-check-in";
import { employeeCheckOutRouter } from "./routes/employee/employee-check-out";
import { listEmployeeVisitsRouter } from "./routes/employee/list-employee-visit";
import { employeeVisitsReportRouter } from "./routes/reports/employee-visits";
import { visitorsVisitReportRouter } from "./routes/reports/visitors-visits";
import { emergencyListReportRouter } from "./routes/reports/emergency-list";
import { emergencySendEmailRouter } from "./routes/reports/emergency-send-email";

const dotenv = require("dotenv").config();

const app = express();

app.use(cookieParser());

app.use(json());
// app.set("trust proxy", true);
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== "development",
//     name: "gatekipa-app-session",
//     httpOnly: true,
//     sameSite: "none",
//   })
// );

const corsOptions: CorsOptions = {
  origin: `${process.env.ALLOWED_FRONTEND_ORIGIN}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(signupRouter);
app.use(listCompanyRouter);
app.use(createCompanyRouter);
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
app.use(createEmployeeRouter);
app.use(employeeStatusRouter);
app.use(listShiftRouter);
app.use(createShiftRouter);
app.use(editEmployeeRouter);
app.use(employeeCheckInRouter);
app.use(employeeCheckOutRouter);
app.use(listEmployeeVisitsRouter);
app.use(employeeVisitsReportRouter);
app.use(visitorsVisitReportRouter);
app.use(emergencyListReportRouter);
app.use(emergencySendEmailRouter);

app.use("/", (req, res) => {
  res.send("GateKipa Backend API");
});

app.all("*", (req, res, next) => {
  throw new Error("Route not found");
});

//app.use(globalErrorMiddleware);

export { app };
