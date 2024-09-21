import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { generateRandom6DigitNumber } from "../../services/util";
import { UserTempToken } from "../../models/UserTempToken";
import { DomainType, EventType } from "../../common/enums";
import { sendEmail } from "../../services/mailer";
import { EMAIL_VERIFICATION_TEMPLATE } from "../../services/email-templates";
import { AppUser } from "../../models/AppUser";

const router = express.Router();

router.post("/api/users/verify-email", async (req: Request, res: Response) => {
  try {
    // * Get emailAddress from body
    const { emailAddress, forSignUp } = req.body;

    let newToken = ``;

    if (forSignUp) {
      const existingUser = await AppUser.findOne({ emailAddress });
      if (existingUser) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `You already have an account with ${emailAddress} email address. Please login to continue.`,
              [],
              400
            )
          );
      }
    }

    const existingToken = await UserTempToken.findOne({
      domain: emailAddress,
      domainType: DomainType.EMAIL,
      eventType: EventType.EMAIL_VERIFICATION,
      isVerified: false,
    });

    if (existingToken) {
      newToken = existingToken.token;
    } else {
      newToken = generateRandom6DigitNumber();
    }

    const expiryDate = new Date();
    expiryDate.setHours(new Date().getHours() + 1);

    await UserTempToken.create({
      domain: emailAddress,
      eventType: EventType.EMAIL_VERIFICATION,
      expiryDate,
      isVerified: false,
      token: newToken,
      domainType: DomainType.EMAIL,
    });

    const emailHtmlContent = EMAIL_VERIFICATION_TEMPLATE.replace(
      "{{VERIFICATION_CODE}}",
      newToken
    );

    await sendEmail(
      emailAddress,
      "GateKipa - Email Verification",
      emailHtmlContent
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
    console.error("Error occurred in verify-email", error);
    res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
  }
});

export { router as verifyEmailRouter };
