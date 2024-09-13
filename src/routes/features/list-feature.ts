import express, { Request, Response } from "express";
import { Feature } from "../../models/Feature";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.get(
  "/api/feature/:type",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const features = await Feature.find({ type, isActive: true });
      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Feature fetched successfully",
            features,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-feature with type", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching features",
            [],
            500
          )
        );
    }
  }
);

router.get(
  "/api/feature/",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const features = await Feature.find({ isActive: true });
      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Features fetched successfully",
            features,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-feature", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching features",
            [],
            500
          )
        );
    }
  }
);

export { router as listFeatureRouter };
