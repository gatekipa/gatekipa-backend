import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Company } from "../../models/Company";
import { Plan } from "../../models/Plan";
import { Invoice } from "../../models/Invoice";

const router = express.Router();

router.post(
  "/api/scheduler/payment-settlement",
  async (req: Request, res: Response) => {
    try {
      const expiredSubscriptions = await Company.find({
        isSubscriptionActive: true,
        nextPaymentDate: { $lt: new Date() },
      });

      if (expiredSubscriptions && expiredSubscriptions.length > 0) {
        for (const subscription of expiredSubscriptions) {
          const today = new Date();
          // * Get the subscription's plan.
          const plan = await Plan.findById(subscription.plan);
          // * Generate a new invoice for expired subscription with the plan's amount.
          await Invoice.create({
            amount: plan.price,
            company: subscription._id,
            invoiceDate: today,
            invoiceNo: "INV-" + Date.now(),
            invoiceStatus: "UNPAID",
            payment: null,
          });

          // * Update the subscription status to "INACTIVE"
          await Company.findByIdAndUpdate(subscription._id, {
            isSubscriptionActive: false,
          });
        }
      }

      console.log("Payment settlement processing completed successfully");
      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Settlement processing completed successfully",
            { processed: true },
            200
          )
        );
    } catch (error) {
      console.error(
        "Error occurred while payment settlement processing",
        error
      );
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while payment settlement processing",
            [],
            500
          )
        );
    }
  }
);

export { router as paymentSettlementRouter };
