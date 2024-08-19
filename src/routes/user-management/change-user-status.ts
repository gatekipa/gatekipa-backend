import express, { Request, Response } from "express";
import { Company } from "../../models/Company";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/users/change-status/:appUserId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req?.user;
      const { appUserId } = req?.params;
      const { isActive } = req?.body;

      const company = await Company.findOne({
        _id: new mongoose.Types.ObjectId(companyId),
        isSubscriptionActive: true,
      });

      if (!company) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Company subscription is expired. Please renew subscription",
              [],
              400
            )
          );
      }

      if (!appUserId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "User information is required", [], 400)
          );
      }

      const newEmployee = await AppUser.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(appUserId),
          companyId: new mongoose.Types.ObjectId(companyId),
        },
        { isActive },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "User status updated successfully",
            newEmployee,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred while change-status", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating user status",
            [],
            500
          )
        );
    }
  }
);

export { router as changeUserStatusRouter };
