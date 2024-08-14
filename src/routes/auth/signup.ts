import express, { Request, Response } from "express";
import { AppUser } from "../../models/AppUser";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { Password } from "../../services/password";
import { UserType } from "../../common/enums";
import jwt from "jsonwebtoken";
import { Employee } from "../../models/Employee";
import { Visitor } from "../../models/Visitor";
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
    const existingUser = await AppUser.find({ emailAddress });

    // * If user already exists, throw error.
    if (existingUser && existingUser.length > 0) {
      const response = new ApiResponseDto(
        true,
        `User already exists with email: ${emailAddress}`,
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
          `No employee profile found for selected company and email address`,
          [],
          404
        );
        return res.status(404).send(response);
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
        });

        // * Add employee id to user
        await AppUser.findByIdAndUpdate(newUser._id, {
          employeeId: existingEmployee[0]._id,
        });
      }
    } else if (userType === UserType.VISITOR) {
      const existingVisitor = await Visitor.find({ emailAddress, companyId });
      if (existingVisitor && existingVisitor.length === 0) {
        console.log("existingVisitor", existingVisitor);
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
          visitorId: existingVisitor[0]._id,
          employeeId: null,
          isEmailVerified,
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

    // req.session.jwt = token;
    // req.user
    // * ===========================

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
