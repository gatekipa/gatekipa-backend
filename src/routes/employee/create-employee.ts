import express, { Request, Response } from "express";
import { Employee } from "../../models/Employee";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Types } from "mongoose";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { generateEmployeeNo } from "../../services/employee";

const router = express.Router();

router.post(
  "/api/employee",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      if (!req?.user) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      const { companyId, appUserId } = req?.user;
      const {
        emailAddress,
        firstName,
        lastName,
        dateOfBirth,
        mobileNo,
        designation,
        shiftId,
      } = req?.body;
      const employeeNo = await generateEmployeeNo();

      const existingUser = await Employee.find({
        emailAddress,
        companyId: new Types.ObjectId(companyId),
      });

      if (existingUser && existingUser.length > 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Employee with email address ${emailAddress} already exists`,
              [],
              400
            )
          );
      }

      const newEmployee = await Employee.create({
        emailAddress,
        firstName,
        lastName,
        dateOfBirth,
        mobileNo,
        employeeNo,
        designation,
        isActive: true,
        companyId: new Types.ObjectId(companyId),
        createdBy: new Types.ObjectId(appUserId),
        shiftId: new Types.ObjectId(shiftId),
      });

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Employees created successfully",
            newEmployee,
            201
          )
        );
    } catch (error) {
      console.error("Error occurred while creating employee", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while creating employee",
            [],
            500
          )
        );
    }
  }
);

export { router as createEmployeeRouter };
