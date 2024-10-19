import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";
import { Visits } from "../../../models/Visits";

const router = express.Router();

router.get(
  "/api/visitor/list-checked-in-visitors",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      const visits = await Visits.find({
        $and: [
          { checkInTime: { $ne: null } },
          { checkInTime: { $lte: today } }, // up to the current time
          { checkInTime: { $gte: yesterday } }, // from 24 hours ago
        ],
      })
        .populate([
          {
            path: "visitor",
            select: "firstName lastName emailAddress mobileNo",
          },
        ])
        .select("_id checkInTime checkoutTime createdAt")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visits fetched successfully", visits, 200)
        );
    } catch (error) {
      console.error("Error occurred during list-checked-in-visitors", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching checked in visitors",
            [],
            500
          )
        );
    }
  }
);

export { router as listCheckedInVisitorRouter };
