import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { EmployeeVisit } from "models/EmployeeVisits";

const router = express.Router();

router.post(
  "/api/employee/checkin/:employeeId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req.user;

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

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingEmployeeVisit = await EmployeeVisit.findOne({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        employee: employeeId,
      });

      if (existingEmployeeVisit && existingEmployeeVisit.checkInTime) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Employee is already checked in for today`,
              [],
              400
            )
          );
      }

      const newEmployeeVisit = new EmployeeVisit({
        employee: employeeId,
        checkInTime: new Date(),
        createdBy: appUserId,
        checkOutTime: null,
      });

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Employee checked in successfully",
            newEmployeeVisit,
            201
          )
        );
    } catch (error) {
      console.error("Error occurred during employee-checkin", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while checking in employee",
            [],
            500
          )
        );
    }
  }
);

export { router as employeeCheckInRouter };
