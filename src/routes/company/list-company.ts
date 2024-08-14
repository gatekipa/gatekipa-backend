import express, { Request, Response } from "express";
import { Company } from "./../../models/Company";
import { ApiResponseDto } from "../../dto/api-response.dto";

const router = express.Router();

router.get("/api/company/:companyId", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findOne({ _id: companyId });

    if (!company) {
      return res
        .status(404)
        .send(
          new ApiResponseDto(
            true,
            "Company not found with provided information",
            [],
            404
          )
        );
    }

    return res
      .status(200)
      .send(
        new ApiResponseDto(false, "Company fetched successfully", company, 200)
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

router.get("/api/company/", async (req: Request, res: Response) => {
  try {
    const companies = await Company.find({
      isSubscriptionActive: true,
      companyPlanSubscription: { $ne: null },
    })
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
