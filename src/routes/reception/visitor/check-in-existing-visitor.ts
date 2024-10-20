import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";
import { Visitor } from "../../../models/Visitor";
import mongoose from "mongoose";
import { Visits } from "../../../models/Visits";

const router = express.Router();

router.post(
  "/api/visitor/check-in-existing-visitor",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId, companyId } = req?.user;
      const { emailAddress, mobileNo, employeeId, purposeOfVisit } = req.body;

      if (!companyId) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Company ID is required", [], 400));
      }

      const existingVisitor = await Visitor.find({
        $or: [{ emailAddress }, { mobileNo }],
      });

      if (!existingVisitor || existingVisitor.length === 0) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              `No visitor found with provided information`,
              [],
              404
            )
          );
      }

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const existingVisitFor24Hours = await Visits.find({
        $and: [
          { checkInTime: { $ne: null } },
          { checkInTime: { $lte: today } }, // up to the current time
          { checkInTime: { $gte: yesterday } }, // from 24 hours ago
          { checkoutTime: null },
          { visitor: new mongoose.Types.ObjectId(existingVisitor[0]?._id) },
        ],
      });

      if (existingVisitFor24Hours.length > 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `You already have a checked in visit within 24 hours. Please checkout first`,
              [],
              400
            )
          );
      }

      const checkInTime = new Date();
      const visit = await Visits.create({
        checkInTime,
        checkoutTime: null,
        comments: null,
        createdBy: new mongoose.Types.ObjectId(appUserId),
        employee: new mongoose.Types.ObjectId(employeeId),
        purposeOfVisit,
        visitor: new mongoose.Types.ObjectId(existingVisitor[0]?._id),
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            `You have checked in successfully at ${checkInTime}`,
            visit,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during check-in-existing-visitor", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while checking in existing visitor",
            [],
            500
          )
        );
    }
  }
);

export { router as checkInExistingVisitorRouter };
