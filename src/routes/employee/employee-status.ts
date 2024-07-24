import express, { Request, Response } from "express";
import { Employee } from "../../models/Employee";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.post(
  "/api/employee/change-status/:employeeId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req?.user;
      const { employeeId } = req?.params;

      if (!employeeId) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Employee ID is required", [], 400));
      }

      const { status } = req?.body;

      const existingEmployee = await Employee.findOne({
        companyId,
        _id: employeeId,
      });

      if (!existingEmployee) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              `No employee found by provided employee information`,
              [],
              404
            )
          );
      }

      const newEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { isActive: status },
        { new: true }
      ).select("firstName lastName emailAddress mobileNo employeeNo isActive");

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Employees status updated successfully",
            newEmployee,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred while updating employee status", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating employee status",
            [],
            500
          )
        );
    }
  }
);

export { router as employeeStatusRouter };
