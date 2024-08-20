import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.get(
  "/api/profile/get-info",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;

      if (!appUserId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "User information is required", [], 400)
          );
      }

      const appUser = await AppUser.findOne({ _id: appUserId }).select(
        "firstName lastName emailAddress mobileNo isActive"
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "User information fetched successfully",
            appUser,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred while fetching user information", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching user information",
            [],
            500
          )
        );
    }
  }
);

export { router as getUserInfoRouter };
