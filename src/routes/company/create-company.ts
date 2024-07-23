import express, { Request, Response } from "express";
import { Company } from "./../../models/Company";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { CompanyCounter } from "../../models/CompanyCounter";
import { AppUser } from "../../models/AppUser";
import { UserType } from "../../common/enums";
import { generateStrongPassword } from "../../services/util";

const router = express.Router();

// ! We need to defend this route to be only called using our frontend app.
router.post("/api/company", async (req: Request, res: Response) => {
  try {
    const {
      companyCode,
      name,
      ownerFirstName,
      ownerLastName,
      emailAddress,
      mobileNo,
      address,
    } = req.body;

    const existingCompany = await Company.findOne({
      emailAddress,
      companyCode,
      mobileNo,
    });

    if (existingCompany) {
      return res
        .status(400)
        .send(new ApiResponseDto(true, "Company already exists", [], 400));
    }

    const newCompany = await Company.create({
      companyCode,
      name,
      emailAddress,
      mobileNo,
      address,
      isSubscriptionActive: true,
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(),
      stripeCustomerId: "testId_123131313",
    });

    await CompanyCounter.create({
      companyId: newCompany.id,
      seq: 100000,
    });

    await AppUser.create({
      companyId: newCompany.id,
      emailAddress,
      employeeId: null,
      firstName: ownerFirstName,
      lastName: ownerLastName,
      isActive: true,
      isLoggedIn: false,
      mobileNo,
      userType: UserType.ADMIN,
      visitorId: null,
      password: generateStrongPassword(8),
    });

    return res
      .status(200)
      .send(
        new ApiResponseDto(
          false,
          "Company created successfully",
          newCompany,
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

export { router as createCompanyRouter };
