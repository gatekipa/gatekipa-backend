import express, { Request, Response } from "express";
import { Employee } from "../../models/Employee";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Types } from "mongoose";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.get(
  "/api/employee/",
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

      const { companyId } = req?.user;

      const { mobileNo, emailAddress, employeeNo } = req.query;

      const filter: any = { companyId };
      if (mobileNo) {
        filter.mobileNo = { $regex: mobileNo };
      }
      if (mobileNo) {
        filter.employeeNo = { $regex: employeeNo };
      }
      if (emailAddress) {
        filter.emailAddress = { $regex: emailAddress };
      }

      const employees = await Employee.find(filter).populate({
        path: "shift",
        select: "_id name isActive",
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Employees fetched successfully",
            employees,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-employee", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching employees",
            [],
            500
          )
        );
    }
  }
);

export { router as listEmployeeRouter };
