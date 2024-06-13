import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import { UserTempToken } from "../../../models/UserTempToken";
import { EventType } from "../../../common/enums";

const router = express.Router();

router.post(
  "/api/users/verify-forgot-pass-token",
  async (req: Request, res: Response) => {
    try {
      // * Get emailAddress from body
      const { emailAddress, token } = req.body;

      const userTempToken = await UserTempToken.find({
        domain: emailAddress,
        isVerified: false,
        eventType: EventType.FORGOT_PASSWORD,
      });

      if (userTempToken && userTempToken.length === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `No generated token entry found for email ${emailAddress}`,
              [],
              400
            )
          );
      }

      if (userTempToken[0].token !== token) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Provided token doesn't match. Incorrect Token`,
              [],
              400
            )
          );
      }

      // * Updating the table that token has been verified.
      await UserTempToken.updateOne(
        { _id: userTempToken[0]._id },
        { isVerified: true },
        { new: true }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, `Token verified successfully`, [], 200)
        );
    } catch (error) {
      console.error("Error occurred in verify-forgot-pass-token", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as verifyForgotPasswordTokenRouter };
