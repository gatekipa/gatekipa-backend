import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";
import { AppUser } from "../../../models/AppUser";
import { Password } from "../../../services/password";

const router = express.Router();

router.post(
  "/api/users/change-password",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { emailAddress } = req.session?.user;
      const { newPassword } = req.body;

      // * Fetch user from database for email address.
      const existingUser = await AppUser.find({
        emailAddress,
        isLoggedIn: true,
      });

      if (!existingUser && existingUser.length === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `No user found with emailAddress ${emailAddress}`,
              [],
              400
            )
          );
      }

      // * Password validations
      // * 1 New and old password should be different
      // * 2 Password complexity 4 char, 5 number.
      // * 3 Password length should be greater than 8

      // * Change User's password with provided password.
      const newHashedPassword = await Password.toHash(newPassword);

      const updatedUser = await AppUser.updateOne(
        { emailAddress },
        { password: newHashedPassword },
        { new: true }
      );

      // * logging out the current user.
      req.session = null;

      // * Return response.
      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Change Password Success", updatedUser, 200)
        );
    } catch (error) {
      console.error("Error occurred during change-password", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while change password",
            [],
            500
          )
        );
    }
  }
);

export { router as changePasswordRouter };
