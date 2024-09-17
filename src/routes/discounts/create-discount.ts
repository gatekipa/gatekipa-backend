import express, { Request, Response } from "express";
import { Discount } from "./../../models/Discount";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";
import { CreateDiscountDto } from "../../dto/discount/create-discount.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.post(
  "/api/discount",
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

      const body: CreateDiscountDto = req.body;
      const {
        code,
        discountType,
        discountValue,
        expiryDate,
        isActive,
        maxNoUsage,
      } = body;

      const existingDiscount = await Discount.findOne({
        code,
        isActive: true,
      });

      if (existingDiscount) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Discount with code ${code} already exists`,
              [],
              400
            )
          );
      }

      const newDiscount = await Discount.create({
        code,
        discountType,
        discountValue,
        expiryDate: new Date(expiryDate),
        isActive,
        maxNoUsage,
        createdBy: appUser._id,
      });

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Discount created successfully",
            newDiscount,
            201
          )
        );
    } catch (error) {
      console.error("Error occurred during creating-discount", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while creating discount",
            [],
            500
          )
        );
    }
  }
);

export { router as createDiscountRouter };