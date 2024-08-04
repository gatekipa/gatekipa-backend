import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";

const router = express.Router();

router.post(
  "/api/visits/:visitorId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;
      const { visitorId } = req.params;
      const {
        purposeOfVisit,
        employeeId,
        checkInWithVisitCreation,
        visitDate,
      } = req.body;

      if (!visitorId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Visitor information is required", [], 400)
          );
      }

      // * Finds visits where checkInTime is null and checkoutTime is not null for visitorId
      const existingCheckInVisits = await Visits.find({
        visitor: visitorId,
        checkInTime: { $ne: null },
        checkoutTime: { $eq: null },
      });

      if (existingCheckInVisits && existingCheckInVisits.length > 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "You already have a checked in visit. Please checkout first before creating a new one",
              [],
              400
            )
          );
      }

      if (!employeeId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Employee Information is required",
              [],
              400
            )
          );
      }

      if (!purposeOfVisit) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Purpose of visit is required", [], 400)
          );
      }

      const newVisit = await Visits.create({
        createdBy: appUserId,
        employee: employeeId,
        purposeOfVisit,
        visitor: visitorId,
        visitDate,
        checkInTime: checkInWithVisitCreation === true ? new Date() : null,
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visit created successfully", newVisit, 201)
        );
    } catch (error) {
      console.error("Error occurred during create-visit", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while creating visit",
            [],
            500
          )
        );
    }
  }
);

export { router as createVisitRouter };
