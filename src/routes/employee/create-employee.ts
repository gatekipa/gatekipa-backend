import { Types } from "mongoose";
import express, { Request, Response } from "express";
import { Employee } from "../../models/Employee";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { generateEmployeeNo } from "../../services/employee";
import { Shift } from "../../models/Shift";
import uploadToImageKit from "services/file-uploader";

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

      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company Information is required", [], 400)
          );
      }

      const {
        emailAddress,
        firstName,
        lastName,
        employeeNo,
        dateOfBirth,
        mobileNo,
        designation,
        shiftId,
        timesheetDueDate,
        payrollPeriodEndDate,
        payDate,
      } = req?.body;

      if (!shiftId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Shift Information is required", [], 400)
          );
      }

      const shift = await Shift.findById(shiftId);
      if (!shift) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No shift found with provided information",
              [],
              404
            )
          );
      }

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

      const newEmployeeNo = await generateEmployeeNo(companyId, employeeNo);

      const avatar = uploadToImageKit(req.file.buffer, req.file.originalname);
      console.log("avatar :>> ", avatar);

      const newEmployee = await Employee.create({
        emailAddress,
        firstName,
        lastName,
        dateOfBirth,
        mobileNo,
        employeeNo: newEmployeeNo,
        designation,
        isActive: true,
        companyId: new Types.ObjectId(companyId),
        createdBy: new Types.ObjectId(appUserId),
        shift: new Types.ObjectId(shift._id),
        timesheetDueDate,
        payDate,
        payrollPeriodEndDate,
      });

      const newEmployeeData = await Employee.findById(newEmployee._id).populate(
        { path: "shift", select: "_id name startTime endTime" }
      );

      return res
        .status(201)
        .send(
          new ApiResponseDto(
            false,
            "Employees created successfully",
            newEmployeeData,
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
