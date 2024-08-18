import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Password } from "../../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", async (req: Request, res: Response) => {
  try {
    // * Fetch email and password from request body
    const { emailAddress, password } = req.body;

    // * Check if user exist for provided email.
    const existingUser = await AppUser.findOne({ emailAddress }).populate({
      path: "companyId",
      populate: {
        path: "plan",
        select: "_id planName",
      },
    });

    // * If user does not exist, tell user to sign up first.
    if (!existingUser) {
      return res
        .status(400)
        .send(
          new ApiResponseDto(
            true,
            `No user found with email ${emailAddress}`,
            [],
            400
          )
        );
    }

    // * If user exists, check if password is correct match
    const isPasswordCorrect = await Password.compare(
      existingUser?.password,
      password
    );

    // * If password is incorrect, throw error for incorrect password.
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send(new ApiResponseDto(true, "Incorrect Password provided", [], 400));
    }

    // * Generate a JWT Token for User
    const token = jwt.sign(
      {
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        fullName: `${existingUser?.firstName} ${existingUser?.lastName}`,
        emailAddress,
        userType: existingUser?.userType,
        companyId: existingUser?.companyId,
        appUserId: existingUser?._id,
      },
      process.env.JWT_KEY
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // * ===========================

    // * If password is correct, login user.

    console.log("existingUser?.companyId :>> ", existingUser?.companyId);
    console.log(existingUser);
    const response = new ApiResponseDto(
      false,
      `User logged in successfully`,
      {
        id: existingUser?._id,
        emailAddress,
        firstName: existingUser?.firstName,
        lastName: existingUser?.lastName,
        userType: existingUser?.userType,
        visitorId: existingUser?.visitorId,
        companyId: existingUser?.companyId,
        // @ts-ignore
        companyId: existingUser?.companyId._id,
        planInfo: existingUser?.companyId,
        employeeId: existingUser?.employeeId,
      },
      200
    );

    await AppUser.findByIdAndUpdate(existingUser?._id, { isLoggedIn: true });
    res.status(200).send(response);
  } catch (error) {
    const response = new ApiResponseDto(true, error.message, [], 500);
    console.error(error);
    res.status(500).send(response);
  }
});

export { router as signinRouter };
