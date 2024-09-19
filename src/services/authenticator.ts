import jwt from "jsonwebtoken";
import { DomainType, EventType, UserType } from "../common/enums";
import { ApiResponseDto } from "../dto/api-response.dto";
import { AuthResponseDto } from "../dto/authentication/auth-response.dto";
import { AppUser } from "../models/AppUser";
import { Password } from "./password";
import { MULTIFACTOR_AUTH_CODE_EMAIL_TEMPLATE } from "./email-templates";
import { generateRandom6DigitNumber, getDate15MinsFromNow } from "./util";
import { UserTempToken } from "../models/UserTempToken";
import { sendEmail } from "./mailer";
import { sendSMS } from "./twilio-messaging";
import { Company } from "../models/Company";
import mongoose from "mongoose";
import { PlanFeatures } from "../models/PlanFeatures";

export class AuthenticatorService {
  public async loginUser(
    emailAddress: string,
    password: string
  ): Promise<AuthResponseDto> {
    let response: ApiResponseDto;
    let token: {};
    try {
      const existingUser = await AppUser.findOne({ emailAddress });

      // * Check if user with email not exists then return error.
      if (!existingUser) {
        response = new ApiResponseDto(
          true,
          `No user found with email ${emailAddress}`,
          [],
          400
        );
      }

      // * Check if user is InActive then return error.
      if (!existingUser.isActive) {
        response = new ApiResponseDto(
          true,
          `User has been marked inactive`,
          [],
          400
        );
      }

      // * Check if user type is SuperAdmin
      if (existingUser.userType === UserType.SUPER_ADMIN) {
        // * If Incorrect password then return error.
        if (!(await this.isPasswordCorrect(existingUser.password, password))) {
          response = new ApiResponseDto(
            true,
            `Incorrect Password provided`,
            [],
            400
          );
        }

        // * If Multi-Factor Authentication is enabled
        if (
          existingUser.isMultiFactorAuthEnabled &&
          existingUser.multiFactorAuthMediums.length > 0
        ) {
          await this.processMultifactorAuthentication(existingUser);
        }

        // * Generate JWT Token and response then return
        token = this.getSuperAdminToken(existingUser);
        response = this.getSuperUserSuccessResponse(existingUser);
        return new AuthResponseDto(response, token);
      } else {
        // * If Incorrect password then return error.
        if (!(await this.isPasswordCorrect(existingUser.password, password))) {
          response = new ApiResponseDto(
            true,
            `Incorrect Password provided`,
            [],
            400
          );
        }

        // * If Multi-Factor Authentication is enabled
        if (
          existingUser.isMultiFactorAuthEnabled &&
          existingUser.multiFactorAuthMediums.length > 0
        ) {
          await this.processMultifactorAuthentication(existingUser);
        }

        const company = await Company.findOne({
          _id: new mongoose.Types.ObjectId(existingUser.companyId),
        }).populate({
          path: "plan",
          select: "_id planName",
        });

        const planFeatures = await PlanFeatures.findOne({
          plan: company.plan,
        }).populate({ path: "plan", select: "_id planName" });

        token = this.getAppUserToken(existingUser, company);
        response = this.getAppUserSuccessResponse(
          existingUser,
          company,
          planFeatures
        );

        await AppUser.findByIdAndUpdate(existingUser?._id, {
          isLoggedIn: true,
        });

        return new AuthResponseDto(response, token);
      }
    } catch (error) {
      console.error(error);
      return new AuthResponseDto(response, token);
    }
  }

  private async isPasswordCorrect(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<Boolean> {
    return await Password.compare(storedPassword, suppliedPassword);
  }

  private getSuperAdminToken(existingUser: any) {
    return jwt.sign(
      {
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        fullName: `${existingUser?.firstName} ${existingUser?.lastName}`,
        emailAddress: existingUser?.emailAddress,
        userType: existingUser?.userType,
        companyId: null,
        appUserId: existingUser?._id,
      },
      process.env.JWT_KEY
    );
  }

  private getSuperUserSuccessResponse(existingUser: any) {
    return new ApiResponseDto(
      false,
      `User logged in successfully`,
      {
        id: existingUser?._id,
        emailAddress: existingUser?.emailAddress,
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        userType: existingUser?.userType,
        visitorId: existingUser?.visitorId,
        companyId: null,
        planInfo: null,
        plan: null,
        employeeId: existingUser?.employeeId,
        isMultiFactorAuthEnabled: existingUser?.isMultiFactorAuthEnabled,
        multiFactorAuthMediums: existingUser?.multiFactorAuthMediums,
      },
      200
    );
  }

  private getAppUserToken(existingUser: any, company: any) {
    return jwt.sign(
      {
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        fullName: `${existingUser?.firstName} ${existingUser?.lastName}`,
        emailAddress: existingUser?.emailAddress,
        userType: existingUser?.userType,
        companyId: company,
        appUserId: existingUser?._id,
      },
      process.env.JWT_KEY
    );
  }

  private getAppUserSuccessResponse(
    existingUser: any,
    company: any,
    planFeatures: any
  ) {
    return new ApiResponseDto(
      false,
      `User logged in successfully`,
      {
        id: existingUser?._id,
        emailAddress: existingUser?.emailAddress,
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        userType: existingUser?.userType,
        visitorId: existingUser?.visitorId,
        companyId: company,
        planInfo: company,
        plan: planFeatures,
        employeeId: existingUser?.employeeId,
        isMultiFactorAuthEnabled: existingUser?.isMultiFactorAuthEnabled,
        multiFactorAuthMediums: existingUser?.multiFactorAuthMediums,
      },
      200
    );
  }

  private async processMultifactorAuthentication(existingUser: any) {
    try {
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
      await Promise.all(notifications);
    } catch (error) {
      console.error("", error);
      throw error;
    }
  }
}
