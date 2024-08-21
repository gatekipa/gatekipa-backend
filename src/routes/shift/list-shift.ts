import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Shift } from "../../models/Shift";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/shift/:shiftId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { shiftId } = req.params;
      const { companyId } = req?.user;
      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      const shifts = await Shift.find({
        companyId,
        _id: new mongoose.Types.ObjectId(shiftId),
      });
      return res
        .status(shifts && shifts.length > 0 ? 200 : 404)
        .send(
          new ApiResponseDto(
            shifts && shifts.length > 0 ? false : true,
            shifts && shifts.length > 0
              ? "Shifts fetched successfully"
              : "No shift found by provided parameter",
            shifts && shifts.length > 0 ? shifts[0] : [],
            shifts && shifts.length > 0 ? 200 : 404
          )
        );
    } catch (error) {
      console.error("Error occurred during list-shift", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching shifts",
            [],
            500
          )
        );
    }
  }
);

router.get("/api/shift", requireAuth, async (req: Request, res: Response) => {
  try {
    const { companyId } = req?.user;
    if (!companyId) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(true, "Company information is required", [], 400)
        );
    }

    const shifts = await Shift.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    return res
      .status(200)
      .send(
        new ApiResponseDto(false, "Shifts fetched successfully", shifts, 200)
      );
  } catch (error) {
    console.error("Error occurred during list-shift", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while fetching shifts",
          [],
          500
        )
      );
  }
});

export { router as listShiftRouter };
