import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";
import { EmployeeVisit } from "../../models/EmployeeVisits";
import { EMERGENCY_LIST_EMAIL } from "../../services/email-templates";
import { sendManyEmail } from "../../services/mailer";
import { Company } from "../../models/Company";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/reports/emergency/send-email",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.user;
      const { type, content, subject } = req.body;

      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company Information is required", [], 400)
          );
      }

      const company = await Company.findOne({
        _id: new mongoose.Types.ObjectId(companyId),
        isSubscriptionActive: true,
        companyPlanSubscription: { $ne: null },
      });

      if (!company) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No active subscription company found with provided information",
              [],
              404
            )
          );
      }

      if (!type || type.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Type is required", [], 400));
      }

      let data = [];
      let toEmailAddress: string[] = [];
      if (type.trim().toLowerCase() === "employee") {
        data = await EmployeeVisit.aggregate([
          {
            $match: {
              $and: [{ checkInTime: { $ne: null } }, { checkOutTime: null }],
            },
          },
          {
            $lookup: {
              from: "employee",
              localField: "employee",
              foreignField: "_id",
              as: "employeeData",
            },
          },
          {
            $unwind: "$employeeData",
          },
          {
            $match: {
              "employeeData.companyId": new mongoose.Types.ObjectId(companyId),
            },
          },
          {
            $project: {
              employee: {
                emailAddress: "$employeeData.emailAddress",
              },
            },
          },
        ]);
        toEmailAddress = data.map((item: any) => item.employee.emailAddress);
      } else if (type.trim().toLowerCase() === "visitor") {
        data = await Visits.aggregate([
          {
            $match: {
              $and: [{ checkInTime: { $ne: null } }, { checkOutTime: null }],
            },
          },
          {
            $lookup: {
              from: "visitor",
              localField: "visitor",
              foreignField: "_id",
              as: "visitorData",
            },
          },
          {
            $unwind: "$visitorData",
          },
          {
            $match: {
              "visitorData.companyId": new mongoose.Types.ObjectId(companyId),
            },
          },
          {
            $project: {
              visitor: {
                emailAddress: "$visitorData.emailAddress",
              },
            },
          },
        ]);
        toEmailAddress = data.map((item: any) => item.visitor.emailAddress);
      } else {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Type should be employee or visitor",
              [],
              400
            )
          );
      }

      // * Making emails unique to avoid sending multiple emails.
      toEmailAddress = Array.from(new Set(toEmailAddress));

      if (toEmailAddress.length === 0) {
        return res
          .status(200)
          .send(
            new ApiResponseDto(
              false,
              "No email addresses found to send email",
              [],
              200
            )
          );
      }

      const emailContent = EMERGENCY_LIST_EMAIL.replace(
        "{{companyName}}",
        company.name
      )
        .replace("{{companyMobileNo}}", company.mobileNo)
        .replace("{{companyEmail}}", company.emailAddress)
        .replace("{{companyMobileNo}}", company.mobileNo)
        .replace("{{companyEmail}}", company.emailAddress);

      await sendManyEmail(toEmailAddress, subject, emailContent);

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Emergency emails sent successfully",
            toEmailAddress,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during report emergency-list", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching report emergency-list",
            [],
            500
          )
        );
    }
  }
);

export { router as emergencySendEmailRouter };
