import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";

const router = express.Router();

router.get(
  "/api/reports/visitors-visits",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const visits = await Visits.find()
        .populate([
          {
            path: "visitor",
            select: "firstName lastName emailAddress mobileNo",
          },
          {
            path: "employee",
            select: "firstName lastName emailAddress mobileNo",
          },
        ])
        .select("purposeOfVisit visitDate checkInTime checkoutTime createdAt");

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visits fetched successfully", visits, 200)
        );
    } catch (error) {
      console.error("Error occurred during report visitors-vists", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching report visitors-vists",
            [],
            500
          )
        );
    }
  }
);

export { router as visitorsVisitReportRouter };
