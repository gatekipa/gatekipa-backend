import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visitor } from "../../models/Visitor";

const router = express.Router();

router.post(
  "/api/visitor/create",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId, companyId } = req.session?.user;
      const { firstName, lastName, emailAddress, mobileNo } = req.body;

      if (!companyId) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Company ID is required", [], 400));
      }

      const existingVisitor = await Visitor.find({ emailAddress });

      if (existingVisitor && existingVisitor.length > 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              `Visitor with email ${emailAddress} already exists`,
              [],
              400
            )
          );
      }

      const newVisitor = await Visitor.create({
        createdBy: appUserId,
        firstName,
        lastName,
        emailAddress,
        mobileNo,
        companyId,
        isActive: true,
      });

      return res.status(200).send(
        new ApiResponseDto(
          false,
          "Visitor created successfully",
          // { visitorId: newVisitor._id, emailAddress },
          newVisitor,
          201
        )
      );
    } catch (error) {
      console.error("Error occurred during create-visitor", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while creating visitor",
            [],
            500
          )
        );
    }
  }
);

export { router as createVisitorRouter };
