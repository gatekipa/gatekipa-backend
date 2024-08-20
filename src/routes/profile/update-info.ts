import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";

const router = express.Router();

router.put(
  "/api/profile/update-info",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;

      const { mobileNo, firstName, lastName } = req.body;

      if (!appUserId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "User information is required", [], 400)
          );
      }

      const updatedAppUser = await AppUser.findOneAndUpdate(
        { _id: appUserId },
        { mobileNo, firstName, lastName },
        { new: true }
      ).select("firstName lastName emailAddress mobileNo isActive");

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "User information updated successfully",
            updatedAppUser,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred while updating user information", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating user information",
            [],
            500
          )
        );
    }
  }
);

export { router as updateUserInfoRouter };
