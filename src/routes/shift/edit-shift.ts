import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Shift } from "../../models/Shift";

const router = express.Router();
router.put(
  "/api/shift/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { isActive, name, startTime, endTime } = req.body;

      console.log("req.body :>> ", req.body);

      const existingShift = await Shift.findById(req.params.id);

      if (!existingShift) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No shift found with provided information",
              [],
              404
            )
          );
      }

      existingShift.isActive = isActive;
      existingShift.name = name;
      existingShift.startTime = startTime;
      existingShift.endTime = endTime;

      const updatedShift = await existingShift.save();

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Plan updated successfully",
            updatedShift,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during update-plan", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating plan",
            [],
            500
          )
        );
    }
  }
);

export { router as editShiftRouter };
