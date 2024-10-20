import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Password } from "../../services/password";
import { UserType } from "../../common/enums";
import jwt from "jsonwebtoken";
import { Employee } from "../../models/Employee";
import { Visitor } from "../../models/Visitor";
import mongoose from "mongoose";
const router = express.Router();

router.post("/api/users/signup", async (req: Request, res: Response) => {
  try {
    const {
      emailAddress,
      password,
      firstName,
      lastName,
      mobileNo,
      companyId,
      userType,
      isEmailVerified,
    } = req.body;

    let newUser = null;

    if (!companyId) {
      const response = new ApiResponseDto(
        true,
        `Company Information is required`,
        [],
        400
      );
      return res.status(400).send(response);
    }

    // * Check if user already exist.
    const existingUser = await AppUser.findOne({ emailAddress });

    // * If user already exists, throw error.
    if (existingUser) {
      const response = new ApiResponseDto(
        true,
        `User already exists with email: ${emailAddress}`,
        [],
        400
      );
      return res.status(400).send(response);
    }

    const existingUserWithMobileNo = await AppUser.findOne({ mobileNo });

    if (existingUserWithMobileNo) {
      const response = new ApiResponseDto(
        true,
        `User already exists with mobile no: ${mobileNo}`,
        [],
        400
      );
      return res.status(400).send(response);
    }

    const hashedPassword = await Password.toHash(password);

    if (userType === UserType.EMPLOYEE) {
      const existingEmployee = await Employee.find({ emailAddress, companyId });
      if (existingEmployee && existingEmployee.length === 0) {
        const response = new ApiResponseDto(
          true,
          `No employee profile found. Please contact your company to create your employee profile.`,
          [],
          400
        );
        return res.status(400).send(response);
      } else {
        // * Create a new user for employee
        newUser = await AppUser.create({
          emailAddress,
          password: hashedPassword,
          isActive: true,
          isLoggedIn: false,
          userType,
          firstName,
          lastName,
          mobileNo,
          companyId,
          visitorId: null,
          employeeId: null,
          isEmailVerified,
          isMultiFactorAuthEnabled: false,
          multiFactorAuthMediums: [],
        });

        // * Add employee id to user
        await AppUser.findByIdAndUpdate(newUser._id, {
          employeeId: existingEmployee[0]._id,
        });
      }
    } else if (userType === UserType.VISITOR) {
      const existingVisitor = await Visitor.findOne({
        companyId: new mongoose.Types.ObjectId(companyId), // Ensure the visitor is in the same company
        $or: [
          { emailAddress }, // Match email
          { mobileNo }, // Or match mobile number
        ],
      });

      if (!existingVisitor) {
        // * Create a new user for visitor
        newUser = await AppUser.create({
          emailAddress,
          password: hashedPassword,
          isActive: true,
          isLoggedIn: false,
          userType,
          firstName,
          lastName,
          mobileNo,
          companyId,
          visitorId: null,
          employeeId: null,
          isEmailVerified,
          isMultiFactorAuthEnabled: false,
          multiFactorAuthMediums: [],
        });

        const newVisitor = await Visitor.create({
          createdBy: newUser._id,
          firstName,
          lastName,
          emailAddress,
          mobileNo,
          companyId,
          isActive: true,
        });

        await AppUser.findByIdAndUpdate(newUser._id, {
          visitorId: newVisitor._id,
        });
      } else {
        // * Create a new user for visitor
        newUser = await AppUser.create({
          emailAddress,
          password: hashedPassword,
          isActive: true,
          isLoggedIn: false,
          userType,
          firstName,
          lastName,
          mobileNo,
          companyId,
          visitorId: existingVisitor._id,
          employeeId: null,
          isEmailVerified,
          isMultiFactorAuthEnabled: false,
          multiFactorAuthMediums: [],
        });
      }
    } else {
      const response = new ApiResponseDto(
        true,
        `Please select a valid user type`,
        [],
        400
      );
      return res.status(400).send(response);
    }

    // * Generate a JWT Token for User
    const token = jwt.sign(
      {
        firstName,
        lastName,
        emailAddress,
        userType: newUser.userType,
        companyId,
        appUserId: newUser._id,
      },
      process.env.JWT_KEY
    );

    const response = new ApiResponseDto(
      false,
      `User sign up successfully!`,
      {
        emailAddress,
        firstName,
        lastName,
        userType: newUser.userType,
        isEmailVerified: newUser.isEmailVerified,
      },
      201
    );
    res.status(201).send(response);
  } catch (error) {
    const response = new ApiResponseDto(
      true,
      "Something went wrong while sign up. Please try again later",
      [],
      500
    );
    console.error(error);
    res.status(500).send(response);
  }
});

export { router as signupRouter };
