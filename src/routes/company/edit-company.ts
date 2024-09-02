import express, { Request, Response } from "express";
import { Company } from "../../models/Company";
import { ApiResponseDto } from "../../dto/api-response.dto";

const router = express.Router();

router.put("/api/company/:companyId", async (req: Request, res: Response) => {
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

    console.log("req.body :>> ", req.body);

    // Update the company with the new information

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: companyId },
      req.body,
      { new: true }
    );

    return res
      .status(200)
      .send(
        new ApiResponseDto(
          false,
          "Company fetched successfully",
          updatedCompany,
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

export { router as editCompanyRouter };
