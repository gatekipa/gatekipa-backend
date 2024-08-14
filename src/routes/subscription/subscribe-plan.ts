import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.post(
  "/api/subscription/subscribe-plan",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req?.user;
      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company information is required", [], 400)
          );
      }

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Applied for plan subscription successfully",
            [],
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during subscribe-plan", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while subscribing plan",
            [],
            500
          )
        );
    }
  }
);

export { router as subscribePlanRouter };
