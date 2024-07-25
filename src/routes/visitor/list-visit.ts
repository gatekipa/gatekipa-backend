import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";

const router = express.Router();

router.get(
  "/api/visits/:visitorId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { visitorId } = req.params;

      if (!visitorId) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Visitor ID is required", [], 400));
      }

      const visits = await Visits.find({ visitor: visitorId })
        .populate({
          path: "employee",
          select: "firstName lastName emailAddress mobileNo",
        })
        .select(
          "visitorId purposeOfVisit visitDate checkInTime checkoutTime id createdBy"
        )
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visits fetched successfully", visits, 200)
        );
    } catch (error) {
      console.error("Error occurred during list-visits", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching visits",
            [],
            500
          )
        );
    }
  }
);

export { router as listVisitsRouter };
