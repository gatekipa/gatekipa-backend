import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Shift } from "../../models/Shift";

const router = express.Router();
router.delete(
  "/api/shift/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
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

      const deletedShift = await Shift.deleteOne({ _id: req.params.id });

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Plan updated successfully",
            deletedShift,
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

export { router as deleteShiftRouter };
