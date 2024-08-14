import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";
import { EmployeeVisit } from "../../models/EmployeeVisits";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/reports/emergency-list/:type",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { type } = req.params;

      const { companyId } = req?.user;

      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      if (!type || type.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Type is required", [], 400));
      }

      let data = [];
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
                firstName: "$employeeData.firstName",
                lastName: "$employeeData.lastName",
                emailAddress: "$employeeData.emailAddress",
                mobileNo: "$employeeData.mobileNo",
              },
              checkInTime: 1,
              checkOutTime: 1,
            },
          },
        ]);
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
                firstName: "$visitorData.firstName",
                lastName: "$visitorData.lastName",
                emailAddress: "$visitorData.emailAddress",
                mobileNo: "$visitorData.mobileNo",
              },
              checkInTime: 1,
              checkOutTime: 1,
            },
          },
        ]);
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

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Emergency list fetched successfully",
            data,
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

export { router as emergencyListReportRouter };
