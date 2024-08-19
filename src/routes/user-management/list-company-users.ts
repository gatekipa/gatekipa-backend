import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Types } from "mongoose";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Company } from "../../models/Company";
import { AppUser } from "../../models/AppUser";

const router = express.Router();

router.get(
  "/api/users/list-company-users",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req?.user;

      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      const company = await Company.findOne({
        _id: new Types.ObjectId(companyId),
        isSubscriptionActive: true,
      });

      if (!company) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Company subscription is expired. Please renew subscription",
              [],
              400
            )
          );
      }

      const { mobileNo, emailAddress, firstName, lastName, isActive } =
        req.query;

      console.log("isActive", isActive);

      const filter: any = { companyId };

      filter.companyId = new Types.ObjectId(companyId);

      if (mobileNo) {
        filter.mobileNo = { $regex: mobileNo };
      }
      if (emailAddress) {
        filter.emailAddress = { $regex: emailAddress };
      }
      if (firstName) {
        filter.firstName = { $regex: firstName };
      }
      if (lastName) {
        filter.lastName = { $regex: lastName };
      }

      if (isActive) {
        filter.isActive = isActive;
      }

      const users = await AppUser.find(filter);

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Users list fetched successfully",
            users,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-company-users", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching company users",
            [],
            500
          )
        );
    }
  }
);

export { router as listCompanyUsersRouter };
