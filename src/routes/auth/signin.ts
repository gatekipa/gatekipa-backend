import mongoose from "mongoose";
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
    // * Fetch email and password from request body
    const { emailAddress, password } = req.body;

    // * Check if user exist for provided email.
    const existingUser = await AppUser.findOne({ emailAddress }).populate({
      path: "companyId",
      populate: {
        path: "plan",
        select: "_id planName",
      },
    });

    // * If user does not exist, tell user to sign up first.
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

    // * If user exists, check if password is correct match
    const isPasswordCorrect = await Password.compare(
      existingUser?.password,
      password
    );

    // * If password is incorrect, throw error for incorrect password.
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send(new ApiResponseDto(true, "Incorrect Password provided", [], 400));
    }

    // * If mulifactor authentication is enabled, generate a code and send it to multi factor auth mediums
    if (existingUser.isMultiFactorAuthEnabled) {
      const code = generateRandom6DigitNumber();
      const today = new Date();
      const mediums = existingUser.multiFactorAuthMediums;
      const IsMediumEmailAndSMS =
        mediums.includes("EMAIL") && mediums.includes("SMS");

      const IsMediumEmail = mediums.includes("EMAIL") && !IsMediumEmailAndSMS;

      const IsMediumSMS = mediums.includes("SMS") && !IsMediumEmailAndSMS;

      let domain = ``;
      let domainType: DomainType;
      let userTempToken = null;
      if (IsMediumEmailAndSMS) {
        domain = `${existingUser.emailAddress},${existingUser.mobileNo}`;
        domainType = DomainType.BOTH;
      } else if (IsMediumEmail) {
        domain = existingUser.emailAddress;
        domainType = DomainType.EMAIL;
      } else if (IsMediumSMS) {
        domain = existingUser.mobileNo;
        domainType = DomainType.SMS;
      }

      userTempToken = await UserTempToken.findOne({
        domainType: domainType,
        domain: domain,
        isVerified: false,
        expiryDate: {
          $gt: today,
        },
        eventType: EventType.MULTIFACTOR_AUTH,
      });

      if (!userTempToken || userTempToken === null) {
        userTempToken = {
          _id: new mongoose.Types.ObjectId(),
          eventType: EventType.MULTIFACTOR_AUTH,
          expiryDate: getDate15MinsFromNow(),
          isVerified: false,
          token: code,
          domain: domain,
          domainType: domainType,
        };
      } else {
        userTempToken.token = code;
        userTempToken.expiryDate = getDate15MinsFromNow();
        userTempToken.isVerified = false;
        userTempToken.domain = domain;
        userTempToken.domainType = domainType;
      }

      await UserTempToken.updateOne(
        {
          _id: userTempToken._id,
        },
        userTempToken,
        { upsert: true }
      );

      const emailTemplate = MULTIFACTOR_AUTH_CODE_EMAIL_TEMPLATE.replace(
        "{{MFA_CODE}}",
        code
      ).replace("{{FIRST_NAME}}", existingUser?.firstName);
      const message = `Your Gate-Kipa Multi-Factor Auth code is ${code}`;

      // * Generate a code and send it to email and SMS both, else send Email or SMS
      if (IsMediumEmailAndSMS) {
        await sendEmail(
          existingUser.emailAddress,
          "Gate-Kipa Multi-Factor Authentication",
          emailTemplate
        );

        await sendSMS(existingUser.mobileNo, message);
      } else if (IsMediumEmail) {
        await sendEmail(
          existingUser.emailAddress,
          "Gate-Kipa Multi-Factor Authentication",
          emailTemplate
        );
      } else if (IsMediumSMS) {
        await sendSMS(existingUser.mobileNo, message);
      }
    }

    // * Generate a JWT Token for User
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
    // * ===========================

    // * If password is correct, login user.
    const response = new ApiResponseDto(
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
        // @ts-ignore
        companyId: existingUser?.companyId._id,
        planInfo: existingUser?.companyId,
        employeeId: existingUser?.employeeId,
        isMultiFactorAuthEnabled: existingUser?.isMultiFactorAuthEnabled,
        multiFactorAuthMediums: existingUser?.multiFactorAuthMediums,
      },
      200
    );

    await AppUser.findByIdAndUpdate(existingUser?._id, { isLoggedIn: true });
    res.status(200).send(response);
  } catch (error) {
    const response = new ApiResponseDto(true, error.message, [], 500);
    console.error(error);
    res.status(500).send(response);
  }
});

export { router as signinRouter };
