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
    const existingUser = await AppUser.find({ emailAddress }).populate([
      { path: "companyId" },
    ]);

    // * If user does not exist, tell user to sign up first.
    if (!existingUser || existingUser.length === 0) {
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
      existingUser[0].password,
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
        firstName: existingUser[0].firstName,
        lastName: existingUser[0].lastName,
        fullName: `${existingUser[0].firstName} ${existingUser[0].lastName}`,
        emailAddress,
        userType: existingUser[0].userType,
        companyId: existingUser[0].companyId,
        appUserId: existingUser[0]._id,
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
    const response = new ApiResponseDto(
      false,
      `User logged in successfully`,
      {
        id: existingUser[0]._id,
        emailAddress,
        firstName: existingUser[0].firstName,
        lastName: existingUser[0].lastName,
        userType: existingUser[0].userType,
        visitorId: existingUser[0].visitorId,
        companyId: existingUser[0].companyId,
        employeeId: existingUser[0].employeeId,
      },
      200
    );

    await AppUser.findByIdAndUpdate(existingUser[0]._id, { isLoggedIn: true });
    res.status(200).send(response);
  } catch (error) {
    const response = new ApiResponseDto(true, error.message, [], 500);
    console.error(error);
    res.status(500).send(response);
  }
});

export { router as signinRouter };
