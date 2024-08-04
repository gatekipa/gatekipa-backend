import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";
import { EmployeeVisit } from "../../models/EmployeeVisits";

const router = express.Router();

router.get(
  "/api/reports/emergency-list/:type",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { type } = req.params;

      if (!type || type.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Type is required", [], 400));
      }
      let data = [];
      if (type.trim().toLowerCase() === "employee") {
        data = await EmployeeVisit.find({
          $and: [{ checkInTime: { $ne: null } }, { checkOutTime: null }],
        }).populate({
          path: "employee",
          select: "firstName lastName emailAddress mobileNo",
        });
      } else if (type.trim().toLowerCase() === "visitor") {
        data = await Visits.find({
          $and: [{ checkInTime: { $ne: null } }, { checkOutTime: null }],
        }).populate({
          path: "visitor",
          select: "firstName lastName emailAddress mobileNo",
        });
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
