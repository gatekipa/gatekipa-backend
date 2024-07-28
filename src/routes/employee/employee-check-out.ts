import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { EmployeeVisit } from "models/EmployeeVisits";
import { Employee } from "models/Employee";
import mongoose, { Types } from "mongoose";

const router = express.Router();

router.post(
  "/api/employee/checkout/:employeeId",
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

      const existingEmployee = await Employee.findOne({
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
        employee: new Types.ObjectId(employeeId),
        checkInTime: { $ne: null },
        checkOutTime: { $eq: null },
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (!existingEmployeeVisit) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Employee hasn't checked in for today or has already checked out`,
              [],
              400
            )
          );
      }

      const updatedEmployeeVisit = await EmployeeVisit.findByIdAndUpdate(
        {
          _id: existingEmployeeVisit._id,
        },
        {
          checkOutTime: new Date(),
          updatedBy: appUserId,
        },
        {
          new: true,
        }
      );

      console.log("updatedEmployeeVisit :>> ", updatedEmployeeVisit);

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Employee checked out successfully",
            updatedEmployeeVisit,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during employee-checkout", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while checking out employee",
            [],
            500
          )
        );
    }
  }
);

export { router as employeeCheckOutRouter };
