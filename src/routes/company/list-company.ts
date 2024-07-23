import express, { Request, Response } from "express";
import { Company } from "./../../models/Company";
import { ApiResponseDto } from "../../dto/api-response.dto";

const router = express.Router();

router.get("/api/company/", async (req: Request, res: Response) => {
  try {
    const companies = await Company.find()
      .select("_id companyCode name emailAddress")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .send(
        new ApiResponseDto(
          false,
          "Companies fetched successfully",
          companies,
          200
        )
      );
  } catch (error) {
    console.error("Error occurred during list-company", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while fetching company",
          [],
          500
        )
      );
  }
});

export { router as listCompanyRouter };
