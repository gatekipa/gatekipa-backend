import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { UserTempToken } from "../../models/UserTempToken";
import { EventType } from "../../common/enums";

const router = express.Router();

router.post(
  "/api/users/verify-email-token",
  async (req: Request, res: Response) => {
    try {
      // * Get emailAddress from body
      const { emailAddress, token } = req.body;

      const existingToken = await UserTempToken.findOne({
        domain: emailAddress,
        eventType: EventType.EMAIL_VERIFICATION,
        token,
        isVerified: false,
      });

      if (!existingToken) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Code cannot be verified for email ${emailAddress}`,
              [],
              400
            )
          );
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
            { emailAddress },
            200
          )
        );
    } catch (error) {
      console.error("Error occurred in verify-email-token", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as verifyEmailTokenRouter };
