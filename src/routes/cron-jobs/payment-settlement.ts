import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Company } from "models/Company";

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
          await Company.findByIdAndUpdate(subscription._id, {
            isSubscriptionActive: false,
            nextPaymentDate: null,
            lastPaymentDate: null,
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
            [],
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
