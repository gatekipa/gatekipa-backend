import express, { Request, Response } from "express";
import { Plan } from "../../models/Plan";
import { ApiResponseDto } from "../../dto/api-response.dto";

const router = express.Router();

router.get("/api/plan/:planId", async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const plans = await Plan.findOne({ _id: planId });
    return res
      .status(200)
      .send(new ApiResponseDto(false, "Plan fetched successfully", plans, 200));
  } catch (error) {
    console.error("Error occurred during list-plan", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while fetching plan details",
          [],
          500
        )
      );
  }
});

router.get("/api/plan/", async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    return res
      .status(200)
      .send(
        new ApiResponseDto(false, "Plans fetched successfully", plans, 200)
      );
  } catch (error) {
    console.error("Error occurred during list-plan", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while fetching plans",
          [],
          500
        )
      );
  }
});

export { router as listPlanRouter };
