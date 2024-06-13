import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import { UserTempToken } from "../../../models/UserTempToken";
import { EventType } from "../../../common/enums";
import { AppUser } from "../../../models/AppUser";
import { Password } from "../../../services/password";

const router = express.Router();

router.post("/api/users/new-password", async (req: Request, res: Response) => {
  try {
    // * Check for verified entry in userTempToken with email, token provided.
    const { emailAddress, token, newPassword } = req.body;

    // * if verified entry found, fetch the user from appUser using emailAddress.
    const existingUserTempToken = await UserTempToken.find({
      domain: emailAddress,
      token,
      isVerified: true,
      eventType: EventType.FORGOT_PASSWORD,
    });

    // * if entry not found, throw error.
    if (existingUserTempToken && existingUserTempToken.length === 0) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(true, "No verified token entry found.", [], 400)
        );
    }

    // * If user not found, throw error.
    const appUser = await AppUser.find({ emailAddress });

    if (appUser && appUser.length === 0) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(
            true,
            `No user found with emailAddress: ${emailAddress}`,
            [],
            400
          )
        );
    }

    // * if user found, update user's password as provided newPassword.
    const hashedPassword = await Password.toHash(newPassword);

    // * Implement new and previous password to be different validation here..

    await AppUser.findByIdAndUpdate(appUser[0].id, {
      password: hashedPassword,
    });

    // * delete the entry.
    await UserTempToken.findByIdAndDelete(existingUserTempToken[0].id);

    // * send the response.
    return res
      .status(200)
      .send(
        new ApiResponseDto(false, `Password updated successfully`, [], 200)
      );
  } catch (error) {
    return res
      .status(500)
      .send(new ApiResponseDto(true, error.message, [], 500));
  }
});

export { router as newPasswordRouter };
