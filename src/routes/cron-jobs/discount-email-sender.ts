import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { DiscountEmail } from "../../models/DiscountEmail";
import { sendEmail } from "../../services/mailer";
import { Company } from "../../models/Company";
import { DISCOUNT_EMAILS_TEMPLATE } from "../../services/email-templates";
import { Discount } from "../../models/Discount";
import { formatDate } from "../../services/util";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/scheduler/discount-email-sender",
  async (req: Request, res: Response) => {
    try {
      const discountEmails = await DiscountEmail.find({
        isEmailSent: false,
        emailSentDate: { $eq: null },
      }).exec();

      if (discountEmails.length === 0) {
        return res
          .status(200)
          .send(
            new ApiResponseDto(
              false,
              "No emails found to send",
              { processed: true },
              200
            )
          );
      }

      const emailToBeSent = [];

      const companies = await Company.find({
        emailAddress: {
          $in: discountEmails.map(
            (discountEmail) => discountEmail.emailAddress
          ),
        },
      }).select("name ownerFirstName ownerLastName emailAddress");

      if (companies.length > 0) {
        for (const mail of discountEmails) {
          console.log("DEBUG", discountEmails);
          const company = companies.find(
            (company) => company.emailAddress === mail.emailAddress
          );

          if (!company) {
            continue;
          }

          const discount = await Discount.findById(mail.discount).select(
            "code expiryDate discountType discountValue"
          );

          if (!discount) {
            console.log("Discount", discount);
            continue;
          }

          const discountTypeText = `${
            discount.discountType === "FLAT"
              ? `a flat $${discount.discountValue}`
              : `${discount.discountValue}%`
          }`;

          const expiryDate = formatDate(discount.expiryDate);

          const emailTemplate = DISCOUNT_EMAILS_TEMPLATE.replace(
            "{{OWNER_NAME}}",
            `${company.ownerFirstName} ${company.ownerLastName}`
          )
            .replace("{{COMPANY_NAME}}", company.name)
            .replace("{{DISCOUNT_CODE}}", discount.code)
            .replace("{{DISCOUNT_TYPE_TEXT}}", discountTypeText)
            .replace("{{EXPIRY_DATE}}", expiryDate)
            .replace(
              "{{GATE_KIPA_URL}}",
              `${process.env.ALLOWED_FRONTEND_ORIGIN}`
            )
            .replace(
              "{{GATE_KIPA_EMAIL}}",
              `${process.env.SENDER_IDENTITY_EMAIL}`
            )
            .replace(
              "{{GATE_KIPA_EMAIL}}",
              `${process.env.SENDER_IDENTITY_EMAIL}`
            );

          emailToBeSent.push(
            sendEmail(
              mail.emailAddress,
              `GateKipa Discount Alert`,
              emailTemplate
            )
          );
        }

        await Promise.all(emailToBeSent);
        await DiscountEmail.updateMany(
          {
            _id: {
              $in: discountEmails.map(
                (discountEmail) =>
                  new mongoose.Types.ObjectId(discountEmail._id)
              ),
            },
          },
          {
            isEmailSent: true,
            emailSentDate: new Date(),
          }
        );
      }

      console.log("Discount emails processing completed successfully");
      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Discount emails sent successfully",
            { processed: true },
            200
          )
        );
    } catch (error) {
      console.error("Error occurred while sending discount emails", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while sending discount emails",
            [],
            500
          )
        );
    }
  }
);

export { router as discountEmailSenderRouter };
