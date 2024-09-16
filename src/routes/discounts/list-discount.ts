import express, { Request, Response } from "express";
import { Discount } from "./../../models/Discount";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";

const router = express.Router();

router.get(
  "/api/discount/list-active",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const activeDiscounts = await Discount.find({
        $and: [
          { isActive: true },
          { expiryDate: { $ne: null } },
          { expiryDate: { $gte: new Date() } },
        ],
      }).select("_id code");

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Discounts fetched successfully",
            activeDiscounts,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during discount list-active", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching discount list-active",
            [],
            500
          )
        );
    }
  }
);

router.get(
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
      const discount = await Discount.findOne({ _id: discountId });

      if (!discount) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "Discount not found with provided information",
              [],
              404
            )
          );
      }

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Discount fetched successfully",
            discount,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-discount", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching discount",
            [],
            500
          )
        );
    }
  }
);

router.get(
  "/api/discount/",
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

      const { isActive, code, type } = req.query;

      const filter: any = {};
      if (isActive) {
        filter.isActive = isActive === "true";
      }
      if (code) {
        filter.code = { $regex: code };
      }
      if (type) {
        filter.discountType = type === "FLAT" ? "FLAT" : "PERCENTAGE";
      }

      const discounts = await Discount.find(filter);

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Discounts fetched successfully",
            discounts,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-discount", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching discount",
            [],
            500
          )
        );
    }
  }
);

export { router as listDiscountRouter };
