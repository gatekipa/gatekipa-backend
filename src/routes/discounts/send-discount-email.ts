import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { DiscountEmailDto } from "../../dto/discount/discount-email.dto";
import { Discount } from "../../models/Discount";
import mongoose from "mongoose";
import { DiscountEmail } from "../../models/DiscountEmail";

const router = express.Router();

router.post(
  "/api/discount/send-emails",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;

      const appUser = await AppUser.findOne({ _id: appUserId });
      if (!appUser) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No user found with provided information",
              [],
              404
            )
          );
      }

      if (appUser.userType !== UserType.SUPER_ADMIN) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Your user is not authorized to perform this action",
              [],
              400
            )
          );
      }

      const body: DiscountEmailDto = req.body;
      const { emailAddress, discountId } = body;

      if (!discountId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Please provide discount information",
              [],
              400
            )
          );
      }

      const discount = await Discount.findOne({
        _id: new mongoose.Types.ObjectId(discountId),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });

      if (!discount) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No valid and active discount found with provided information",
              [],
              404
            )
          );
      }

      const discountEmailsDocuments = emailAddress.map((email) => ({
        emailAddress: email,
        discount: discount._id,
        isEmailSent: false,
        emailSentDate: null,
      }));

      if (discountEmailsDocuments.length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "No email address provided", [], 400));
      }

      await DiscountEmail.insertMany(discountEmailsDocuments);

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Discount emails dispatched successfully",
            [],
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during sending discount emails", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while sending discount emails",
            [],
            500
          )
        );
    }
  }
);

export { router as sendDiscountEmailRouter };
