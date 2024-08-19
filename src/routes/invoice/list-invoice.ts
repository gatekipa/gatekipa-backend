import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Invoice } from "../../models/Invoice";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/invoice/",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.user;

      if (!companyId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Company Information is required", [], 400)
          );
      }

      const invoices = await Invoice.find({
        company: new mongoose.Types.ObjectId(companyId),
      }).sort({
        createdAt: -1,
      });

      return res
        .status(200)
        .send(
          new ApiResponseDto(
            false,
            "Invoices fetched successfully",
            invoices,
            200
          )
        );
    } catch (error) {
      console.error("Error occurred during list-invoices", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while fetching invoices",
            [],
            500
          )
        );
    }
  }
);

export { router as listInvoiceRouter };
