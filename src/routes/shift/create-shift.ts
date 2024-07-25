import { Types } from "mongoose";
import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Shift } from "../../models/Shift";

const router = express.Router();

router.post("/api/shift", requireAuth, async (req: Request, res: Response) => {
  try {
    const { companyId, appUserId } = req?.user;
    if (!companyId) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(true, "Company information is required", [], 400)
        );
    }

    const { name, startTime, endTime } = req?.body;
    if (!name || !startTime || !endTime) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(
            true,
            "Please provide all mandatory fields in correct format",
            [],
            400
          )
        );
    }

    const newShift = await Shift.create({
      name,
      startTime,
      endTime,
      isActive: true,
      companyId: new Types.ObjectId(companyId),
      createdBy: new Types.ObjectId(appUserId),
    });

    return res
      .status(201)
      .send(
        new ApiResponseDto(false, "Shift created successfully", newShift, 201)
      );
  } catch (error) {
    console.error("Error occurred while creating shift", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while creating shift",
          [],
          500
        )
      );
  }
});

export { router as createShiftRouter };
