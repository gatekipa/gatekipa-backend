import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import mongoose from "mongoose";
import { Company } from "../../models/Company";
import { Payment } from "../../models/Payment";
import { Invoice } from "../../models/Invoice";
import { CompanyPlanSubscription } from "../../models/CompanyPlanSubscription";

const router = express.Router();

router.post(
  "/api/subscription/confirm-payment",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId, appUserId } = req?.user;
      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      const company = await Company.findOne({
        _id: new mongoose.Types.ObjectId(companyId),
      });

      if (!company) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No company found with provided information",
              [],
              404
            )
          );
      }

      const { planId, actualAmount, payableAmount, stripePayment } = req.body;

      // * Create a payment entry
      const payment = await Payment.create({
        amount: payableAmount,
        company: company._id,
        discount: null,
        stripePaymentIntent: stripePayment,
      });

      // * Check for existing invoice with UNPAID OR OVERDUE status else generate an invoice for the payment made
      const existingInvoice = await Invoice.findOne({
        company: company._id,
        invoiceStatus: {
          $in: ["UNPAID", "OVERDUE"],
        },
      });

      if (existingInvoice) {
        await Invoice.findByIdAndUpdate(existingInvoice._id, {
          payment: payment._id,
          invoiceStatus: "PAID",
        });
      } else {
        await Invoice.create({
          amount: payableAmount,
          company: company._id,
          invoiceDate: new Date(),
          invoiceNo: "INV-" + Date.now(),
          invoiceStatus: "PAID",
          payment: payment._id,
        });
      }

      // * Create a compnay plan subscription entry
      await CompanyPlanSubscription.create({
        company: company._id,
        createdBy: appUserId,
        plan: new mongoose.Types.ObjectId(planId),
        status: "SUBSCRIBED",
      });

      // * Update the company's plan and subscription status
      const today = new Date();
      const nextPaymentDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      const updatedCompany = await Company.findByIdAndUpdate(
        company._id,
        {
          plan: new mongoose.Types.ObjectId(planId),
          isSubscriptionActive: true,
          lastPaymentDate: today,
          nextPaymentDate,
        },
        { new: true }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Payment processing completed successfully",
            updatedCompany,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during confirming payment", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while confirming payment",
            [],
            500
          )
        );
    }
  }
);

export { router as confirmPaymentRouter };
