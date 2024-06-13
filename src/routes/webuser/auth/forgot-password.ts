import express, { Request, Response } from "express";
import { AppUser } from "../../../models/AppUser";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import { generateRandom6DigitNumber } from "../../../services/util";
import { UserTempToken } from "../../../models/UserTempToken";
import { EventType } from "../../../common/enums";
import { sendEmail } from "../../../services/mailer";

const router = express.Router();

router.post(
  "/api/users/forgot-password",
  async (req: Request, res: Response) => {
    try {
      // * Get emailAddress from body
      const { emailAddress } = req.body;

      // * Check if provided email has a user in our db.
      const existingUser = await AppUser.find({ emailAddress });

      if (existingUser && existingUser.length === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `No user exist with provided email: ${emailAddress}`,
              [],
              400
            )
          );
      }

      // * if user exists, send a verification code on the email.
      const newToken = generateRandom6DigitNumber();
      const expiryDate = new Date();
      expiryDate.setHours(new Date().getHours() + 1);

      await UserTempToken.create({
        domain: emailAddress,
        eventType: EventType.FORGOT_PASSWORD,
        expiryDate,
        isVerified: false,
        token: newToken,
      });

      // * Send token on email
      await sendEmail(
        emailAddress,
        "Forgot Password - Email Verification",
        `Your verification code is ${newToken}`
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Verification email sent successfully",
            [],
            200
          )
        );
    } catch (error) {
      console.error("Error occurred in forgot-password", error);
      res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
    }
  }
);

export { router as forgotPasswordRouter };
