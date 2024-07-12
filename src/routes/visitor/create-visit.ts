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
      const { appUserId } = req.session?.user;
      const { visitorId } = req.params;
      const {
        purposeOfVisit,
        personToMeet,
        personToMeetEmail,
        personToMeetMobileNo,
        employeeId,
        checkInWithVisitCreation,
      } = req.body;

      if (!visitorId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Visitor information is required", [], 400)
          );
      }

      if (!employeeId && !personToMeet) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Employee Information or Person to meet is required",
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
        employeeId: employeeId ?? null,
        personToMeet: personToMeet ?? null,
        personToMeetEmail: personToMeetEmail ?? null,
        personToMeetMobileNo: personToMeetMobileNo ?? null,
        purposeOfVisit,
        visitorId,
        checkInTime: checkInWithVisitCreation === true ? new Date() : null,
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Visit created successfully",
            { visitId: newVisit._id },
            201
          )
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
