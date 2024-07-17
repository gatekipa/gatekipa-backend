import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visitor } from "../../models/Visitor";

const router = express.Router();

router.get("/api/visitor", requireAuth, async (req: Request, res: Response) => {
  try {
    const { companyId } = req?.user;

    if (!companyId) {
      return res
        .status(400)
        .send(new ApiResponseDto(true, "Company ID is required", [], 400));
    }

    const { mobileNo, emailAddress } = req.query;

    const filter: any = { companyId };
    if (mobileNo) {
      filter.mobileNo = { $regex: mobileNo };
    }
    if (emailAddress) {
      filter.emailAddress = { $regex: emailAddress };
    }

    // * Get all visitors
    const existingVisitors = await Visitor.find(filter);

    return res
      .status(200)
      .send(
        new ApiResponseDto(
          false,
          existingVisitors.length > 0
            ? "Visitors fetched successfully"
            : "No visitors found",
          existingVisitors,
          200
        )
      );
  } catch (error) {
    console.error("Error occurred during list-visitor", error);
    return res
      .status(500)
      .send(
        new ApiResponseDto(
          true,
          "Something wen't wrong while fetching visitors",
          [],
          500
        )
      );
  }
});

export { router as listVisitorRouter };
