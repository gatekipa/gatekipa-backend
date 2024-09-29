import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { generateRandom6DigitNumber } from "../../services/util";
import { UserTempToken } from "../../models/UserTempToken";
import { DomainType, EventType } from "../../common/enums";
import { AppUser } from "../../models/AppUser";
import { sendSMS } from "../../services/twilio-messaging";

const router = express.Router();

router.post(
  "/api/users/verify-mobileno",
  async (req: Request, res: Response) => {
    try {
      // * Get mobile no from body
      const { mobileNo, forSignUp } = req.body;

      if (forSignUp) {
        const existingUser = await AppUser.findOne({ mobileNo });
        if (existingUser) {
          return res
            .status(400)
            .send(
              new ApiResponseDto(
                true,
                `User already exist with provided mobile np: ${mobileNo}`,
                [],
                400
              )
            );
        }
      }

      let newToken = ``;

      const existingToken = await UserTempToken.findOne({
        domain: mobileNo,
        domainType: DomainType.SMS,
        eventType: EventType.MOBILENO_VERIFICATION,
        isVerified: false,
      });

      if (existingToken) {
        newToken = generateRandom6DigitNumber();
        await UserTempToken.updateOne(
          {
            _id: existingToken._id,
          },
          {
            token: newToken,
          }
        );
      } else {
        newToken = generateRandom6DigitNumber();
      }

      const expiryDate = new Date();
      expiryDate.setHours(new Date().getHours() + 1);

      await UserTempToken.create({
        domain: mobileNo,
        domainType: DomainType.SMS,
        eventType: EventType.MOBILENO_VERIFICATION,
        expiryDate,
        isVerified: false,
        token: newToken,
      });

      const message = `Your GateKipa verification code is ${newToken}`;

      const result = await sendSMS(mobileNo, message);

      if (!result) console.error(`Failed to send SMS to ${mobileNo}`);

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "SMS sent with verification code successfully",
            [],
            200
          )
        );
    } catch (error) {
      console.error("Error occurred in verify-mobileno", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as verifyMobileNoRouter };
