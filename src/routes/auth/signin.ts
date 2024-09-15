import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Password } from "../../services/password";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/mailer";
import {
  generateRandom6DigitNumber,
  getDate15MinsFromNow,
} from "../../services/util";
import { UserTempToken } from "../../models/UserTempToken";
import { DomainType, EventType } from "../../common/enums";
import { MULTIFACTOR_AUTH_CODE_EMAIL_TEMPLATE } from "../../services/email-templates";
import { sendSMS } from "../../services/twilio-messaging";

const router = express.Router();

router.post("/api/users/signin", async (req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;

    const existingUser = await AppUser.findOne({ emailAddress }).populate({
      path: "companyId",
      populate: {
        path: "plan",
        select: "_id planName",
      },
    });

    if (!existingUser) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(
            true,
            `No user found with email ${emailAddress}`,
            [],
            400
          )
        );
    }

    if (!existingUser.isActive) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(true, `User has been marked inactive`, [], 400)
        );
    }

    const isPasswordCorrect = await Password.compare(
      existingUser?.password,
      password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send(new ApiResponseDto(true, "Incorrect Password provided", [], 400));
    }

    // Optimize MFA handling
    if (existingUser.isMultiFactorAuthEnabled) {
      const code = generateRandom6DigitNumber();
      const today = new Date();
      const mediums = existingUser.multiFactorAuthMediums;

      const domainType =
        mediums.includes("EMAIL") && mediums.includes("SMS")
          ? DomainType.BOTH
          : mediums.includes("EMAIL")
          ? DomainType.EMAIL
          : DomainType.SMS;

      const domain =
        domainType === DomainType.BOTH
          ? `${existingUser.emailAddress},${existingUser.mobileNo}`
          : domainType === DomainType.EMAIL
          ? existingUser.emailAddress
          : existingUser.mobileNo;

      let userTempToken = await UserTempToken.findOneAndUpdate(
        {
          domainType,
          domain,
          isVerified: false,
          expiryDate: { $gt: today },
          eventType: EventType.MULTIFACTOR_AUTH,
        },
        {
          token: code,
          expiryDate: getDate15MinsFromNow(),
          isVerified: false,
          domain,
          domainType,
          eventType: EventType.MULTIFACTOR_AUTH,
        },
        { upsert: true, new: true }
      );

      // Create email template and message
      const emailTemplate = MULTIFACTOR_AUTH_CODE_EMAIL_TEMPLATE.replace(
        "{{MFA_CODE}}",
        code
      ).replace("{{FIRST_NAME}}", existingUser?.firstName);
      const message = `Your Gate-Kipa Multi-Factor Auth code is ${code}`;

      // Send MFA notifications in parallel
      const notifications = [];

      if (mediums.includes("EMAIL")) {
        notifications.push(
          sendEmail(
            existingUser.emailAddress,
            "Gate-Kipa Multi-Factor Authentication",
            emailTemplate
          )
        );
      }
      if (mediums.includes("SMS")) {
        notifications.push(sendSMS(existingUser.mobileNo, message));
      }

      await Promise.all(notifications); // Await all notifications simultaneously
    }

    const token = jwt.sign(
      {
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        fullName: `${existingUser?.firstName} ${existingUser?.lastName}`,
        emailAddress,
        userType: existingUser?.userType,
        companyId: existingUser?.companyId,
        appUserId: existingUser?._id,
      },
      process.env.JWT_KEY
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    await AppUser.findByIdAndUpdate(existingUser?._id, { isLoggedIn: true });

    res.status(200).send(
      new ApiResponseDto(
        false,
        `User logged in successfully`,
        {
          id: existingUser?._id,
          emailAddress,
          firstName: existingUser?.firstName,
          lastName: existingUser?.lastName,
          userType: existingUser?.userType,
          visitorId: existingUser?.visitorId,
          companyId: existingUser?.companyId,
          planInfo: existingUser?.companyId,
          employeeId: existingUser?.employeeId,
          isMultiFactorAuthEnabled: existingUser?.isMultiFactorAuthEnabled,
          multiFactorAuthMediums: existingUser?.multiFactorAuthMediums,
        },
        200
      )
    );
  } catch (error) {
    console.error(error);
    res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
  }
});

export { router as signinRouter };
