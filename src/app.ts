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
import { verifyEmailRouter } from "./routes/auth/verify-email";
import { verifyEmailTokenRouter } from "./routes/auth/verify-email-token";
import { listPlanRouter } from "./routes/plan/list-plan";
import { createPaymentIntentRouter } from "./routes/subscription/create-payment-intent";
import { confirmPaymentRouter } from "./routes/subscription/confirm-payment";
import { listInvoiceRouter } from "./routes/invoice/list-invoice";

const dotenv = require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(json());

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
app.use(emergencyListReportRouter);
app.use(emergencySendEmailRouter);
app.use(visitorsVisitReportRouter);
app.use(verifyEmailRouter);
app.use(verifyEmailTokenRouter);
app.use(listPlanRouter);
app.use(createPaymentIntentRouter);
app.use(confirmPaymentRouter);
app.use(listInvoiceRouter);

app.use("/", (req, res) => {
  res.send("GateKipa Backend API");
});

app.all("*", (req, res, next) => {
  throw new Error("Route not found");
});

//app.use(globalErrorMiddleware);

export { app };
