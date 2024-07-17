import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";

const router = express.Router();

router.post(
  "/api/visits/checkin/:visitId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;
      const { visitId } = req.params;

      if (!visitId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Visit information is required", [], 400)
          );
      }

      const visit = await Visits.findById(visitId);
      if (!visit) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No visit found by provided visit information",
              [],
              404
            )
          );
      }

      if (visit.checkInTime) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Visit already checked in", [], 400));
      }

      await Visits.findByIdAndUpdate(visitId, {
        checkInTime: new Date(),
        updatedBy: appUserId,
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visitor Checked In Successfully", [], 200)
        );
    } catch (error) {
      console.error("Error occurred during checkIn-visit", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while checking in visit",
            [],
            500
          )
        );
    }
  }
);

export { router as checkInVisitRouter };
