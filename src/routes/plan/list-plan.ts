import express, { Request, Response } from "express";
import { Plan } from "../../models/Plan";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { PlanFeatures } from "../../models/PlanFeatures";

const router = express.Router();

router.get(
  "/api/plan/:planId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { planId } = req.params;
      const plans = await PlanFeatures.findOne({ plan: planId }).populate({
        path: "plan",
      });
      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Plan fetched successfully", plans, 200)
        );
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
  }
);

router.get("/api/plan/", async (req: Request, res: Response) => {
  try {
    const plans = await PlanFeatures.aggregate([
      {
        $lookup: {
          from: "plan",
          localField: "plan",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $addFields: {
          "plan.id": "$plan._id",
        },
      },
      {
        $sort: { "plan.planName": 1 },
      },
      {
        $project: {
          "plan._id": 0,
          "plan.createdBy": 0,
          "plan.updatedBy": 0,
          "plan.createdAt": 0,
          "plan.updatedAt": 0,
          "plan.isActive": 0,
          "plan.__v": 0,
          __v: 0,
          _id: 0,
          createdBy: 0,
          updatedBy: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

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
