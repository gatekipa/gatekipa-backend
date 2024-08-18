import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Stripe } from "stripe";
import mongoose from "mongoose";
import { Company } from "../../models/Company";

const router = express.Router();

// * Creates payment intent
router.post(
  "/api/subscription/create-payment-intent",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req?.user;
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

      const { actualAmount, payableAmount } = req.body;

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(payableAmount * 100),
        currency: "usd",
        customer: company.stripeCustomerId,
      });

      return res.status(200).send(
        new ApiResponseDto(
          false,
          "Payment Intent created successfully",
          {
            clientSecret: paymentIntent.client_secret,
          },
          200
        )
      );
    } catch (error) {
      console.error("Error occurred during creating payment intent", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while creating payment intent",
            [],
            500
          )
        );
    }
  }
);

export { router as createPaymentIntentRouter };
