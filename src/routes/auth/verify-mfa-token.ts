import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { UserTempToken } from "../../models/UserTempToken";
import { DomainType, EventType } from "../../common/enums";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { AppUser } from "../../models/AppUser";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/users/verify-mfa-token",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;

      const appUser = await AppUser.findById(
        new mongoose.Types.ObjectId(appUserId)
      ).select(
        "isMultiFactorAuthEnabled multiFactorAuthMediums emailAddress mobileNo"
      );

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

      const { isMultiFactorAuthEnabled, multiFactorAuthMediums } = appUser;

      if (!isMultiFactorAuthEnabled) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Multi-factor authentication is not enabled",
              [],
              400
            )
          );
      }

      const domainType =
        multiFactorAuthMediums.includes("EMAIL") &&
        multiFactorAuthMediums.includes("SMS")
          ? DomainType.BOTH
          : multiFactorAuthMediums.includes("EMAIL")
          ? DomainType.EMAIL
          : DomainType.SMS;

      const domain =
        domainType === DomainType.BOTH
          ? `${appUser.emailAddress},${appUser.mobileNo}`
          : domainType === DomainType.EMAIL
          ? appUser.emailAddress
          : appUser.mobileNo;

      // * Get token from body
      const { token } = req.body;

      const existingToken = await UserTempToken.findOne({
        domain: domain,
        eventType: EventType.MULTIFACTOR_AUTH,
        domainType: domainType,
        token,
        isVerified: false,
        expiryDate: { $gte: new Date() },
      });

      if (!existingToken) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, `Code cannot be verified`, [], 400));
      }

      await UserTempToken.updateOne(
        {
          _id: existingToken._id,
        },
        {
          isVerified: true,
        }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Code verified successfully",
            { emailAddress: appUser.emailAddress, mobileNo: appUser.mobileNo },
            200
          )
        );
    } catch (error) {
      console.error("Error occurred in verify-mfa-token", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as verifyMFATokenRouter };
