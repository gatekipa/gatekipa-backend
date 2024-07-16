import express, { Request, Response } from "express";
import { Employee } from "models/Employee";
import { ApiResponseDto } from "../../dto/api-response.dto";

const router = express.Router();

router.get("/api/employee/:companyId", async (req: Request, res: Response) => {
  const { companyId } = req.params;
  try {
    const employees = await Employee.find({ companyId }).sort({
      createdAt: -1,
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
});

export { router as listEmployeeRouter };