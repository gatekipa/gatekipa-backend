import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";
import { Visitor } from "../../../models/Visitor";
import mongoose from "mongoose";
import { Visits } from "../../../models/Visits";

const router = express.Router();

router.post(
  "/api/visitor/create-check-in-visitor",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId, companyId } = req?.user;
      const {
        firstName,
        lastName,
        emailAddress,
        mobileNo,
        employeeId,
        purposeOfVisit,
      } = req.body;

      if (!companyId) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Company ID is required", [], 400));
      }

      const existingVisitor = await Visitor.find({
        $or: [{ emailAddress }, { mobileNo }],
      });

      if (existingVisitor.length > 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Visitor with provided email or mobile no already exists`,
              [],
              400
            )
          );
      }

      const newVisitor = await Visitor.create({
        firstName,
        lastName,
        emailAddress,
        mobileNo,
        companyId: new mongoose.Types.ObjectId(companyId),
        employeeId: new mongoose.Types.ObjectId(employeeId),
        purposeOfVisit,
        isActive: true,
        createdBy: new mongoose.Types.ObjectId(appUserId),
      });

      const checkInTime = new Date();
      const visit = await Visits.create({
        checkInTime,
        checkoutTime: null,
        comments: null,
        visitDate: checkInTime,
        createdBy: new mongoose.Types.ObjectId(appUserId),
        employee: new mongoose.Types.ObjectId(employeeId),
        purposeOfVisit,
        visitor: new mongoose.Types.ObjectId(newVisitor._id),
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

export { router as createAndCheckInExistingVisitorRouter };
