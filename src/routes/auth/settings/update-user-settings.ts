import mongoose from "mongoose";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";
import { AppUser } from "../../../models/AppUser";

const router = express.Router();

router.post(
  "/api/user-settings",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;
      const { isMultiFactorAuthEnabled, multiFactorAuthMediums } = req.body;

      if (!appUserId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "User information is required", [], 400)
          );
      }

      const appUser = await AppUser.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(appUserId),
        },
        { $set: { isMultiFactorAuthEnabled, multiFactorAuthMediums } },
        { new: true }
      ).select("isMultiFactorAuthEnabled multiFactorAuthMediums");

      if (!appUser) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "User not found with provided information",
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
            "User settings fetched successfully",
            appUser,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during user-settings", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching user-settings",
            [],
            500
          )
        );
    }
  }
);

export { router as updateUserSettingsRouter };
