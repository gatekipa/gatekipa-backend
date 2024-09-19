import express, { Request, Response } from "express";
import { Discount } from "./../../models/Discount";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";
import { CreateDiscountDto } from "../../dto/discount/create-discount.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/discount/:discountId",
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

      const { discountId } = req.params;

      const body: CreateDiscountDto = req.body;
      const {
        code,
        discountType,
        discountValue,
        expiryDate,
        isActive,
        maxNoUsage,
      } = body;

      if (!code || code.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, `Code is required`, [], 400));
      }

      if (!discountValue || discountValue === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Discount value should be greater than zero`,
              [],
              400
            )
          );
      }

      if (!maxNoUsage || maxNoUsage === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Max no usage value should be greater than zero`,
              [],
              400
            )
          );
      }

      if (!expiryDate || expiryDate <= new Date()) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Expiry date should be greater than today's date`,
              [],
              400
            )
          );
      }

      const existingDiscount = await Discount.findById(
        new mongoose.Types.ObjectId(discountId)
      );

      if (!existingDiscount) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              `Discount not found with provided information`,
              [],
              404
            )
          );
      }

      const existingDiscountWithCode = await Discount.findOne({
        code,
        isActive: true,
        _id: { $ne: existingDiscount._id },
      });

      if (existingDiscountWithCode) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Discount with this code '${code}' already exists`,
              [],
              400
            )
          );
      }

      const updatedDiscount = await Discount.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(discountId),
        },
        {
          code,
          discountType,
          discountValue,
          expiryDate: new Date(expiryDate),
          isActive,
          maxNoUsage,
          updatedBy: appUser._id,
        },
        { new: true }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Discount updated successfully",
            updatedDiscount,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during updating-discount", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating discount",
            [],
            500
          )
        );
    }
  }
);

export { router as updateDiscountRouter };
