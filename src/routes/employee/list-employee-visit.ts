import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { EmployeeVisit } from "models/EmployeeVisits";

const router = express.Router();

router.get(
  "/api/employee/visit/:employeeId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Employee Information is required",
              [],
              400
            )
          );
      }

      const existingEmployee = await EmployeeVisit.findOne({
        _id: employeeId,
      });

      if (!existingEmployee) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              `No employee found with provided information`,
              [],
              404
            )
          );
      }

      const employeeVisits = await EmployeeVisit.find({
        employee: employeeId,
      }).sort({ createdAt: -1 });

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
      console.error("Error occurred during list-employee-visits", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching employee visits",
            [],
            500
          )
        );
    }
  }
);

export { router as listEmployeeVisitsRouter };
