import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { UserTempToken } from "../../models/UserTempToken";
import { DomainType, EventType } from "../../common/enums";

const router = express.Router();

router.post(
  "/api/users/verify-mobileno-token",
  async (req: Request, res: Response) => {
    try {
      // * Get emailAddress from body
      const { mobileNo, token } = req.body;

      const existingToken = await UserTempToken.findOne({
        domain: mobileNo,
        domainType: DomainType.SMS,
        eventType: EventType.MOBILENO_VERIFICATION,
        token,
        isVerified: false,
      });

      if (!existingToken) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Code cannot be verified for mobile no ${mobileNo}`,
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
          $set: {
            isVerified: true,
          },
        }
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Code verified successfully",
            { mobileNo },
            200
          )
        );
    } catch (error) {
      console.error("Error occurred in verify-mobileno-token", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as verifyMobileNoTokenRouter };
