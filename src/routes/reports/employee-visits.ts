import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { EmployeeVisit } from "../../models/EmployeeVisits";

const router = express.Router();

router.get(
  "/api/reports/employee-visits",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const employeeVisits = await EmployeeVisit.find()
        .populate({
          path: "employee",
          select:
            "firstName lastName designation employeeNo emailAddress mobileNo",
        })
        .select("checkInTime checkoutTime");

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Employee visits fetched successfully",
            employeeVisits,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during report employee-visits", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching report employee visits",
            [],
            500
          )
        );
    }
  }
);

export { router as employeeVisitsReportRouter };
