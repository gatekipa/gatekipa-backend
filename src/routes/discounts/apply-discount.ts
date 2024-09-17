import express, { Request, Response } from "express";
import { Discount } from "./../../models/Discount";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { ApplyDiscountDto } from "../../dto/discount/apply-discount.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";
import { CompanyAvailedDiscount } from "../../models/CompanyAvailedDiscount";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/discount/apply-code",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId: company, appUserId } = req?.user;

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

      if (appUser.userType !== UserType.ADMIN) {
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

      const body: ApplyDiscountDto = req.body;
      const { code, payableAmount } = body;

      const response = {
        discountedAmount: 0,
        payableAmount,
        appliedDiscountId: "",
      };

      const discount = await Discount.findOne({
        code,
        isActive: true,
        maxNoUsage: { $gt: 0 },
        expiryDate: { $gte: new Date() },
      });

      if (!discount) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No valid and active found with provided code",
              [],
              404
            )
          );
      }

      const companyAvailedDiscount = await CompanyAvailedDiscount.findOne({
        discount: discount._id,
        company: new mongoose.Types.ObjectId(company.id),
      });

      if (companyAvailedDiscount) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Discount code has already been availed by your company",
              [],
              400
            )
          );
      }

      if (
        discount.discountType === "FLAT" &&
        payableAmount < discount.discountValue
      ) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Discounted amount is greater than payable amount. Not Allowed",
              [],
              400
            )
          );
      }

      response.appliedDiscountId = discount._id.toHexString();

      if (discount.discountType === "FLAT") {
        response.discountedAmount = discount.discountValue;
        response.payableAmount = payableAmount - discount.discountValue;
      } else if (discount.discountType === "PERCENTAGE") {
        response.discountedAmount =
          (payableAmount * discount.discountValue) / 100;
        response.payableAmount = payableAmount - response.discountedAmount;
      }

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Discount code applied successfully",
            response,
            201
          )
        );
    } catch (error) {
      console.error("Error occurred during apply-discount", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while applying discount",
            [],
            500
          )
        );
    }
  }
);

export { router as applyDiscountRouter };
