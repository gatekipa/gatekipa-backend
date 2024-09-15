import express, { Request, Response } from "express";
import { Plan } from "../../models/Plan";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { CreatePlanDto } from "../../dto/plan/create-plan.dto";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import mongoose from "mongoose";
import { PlanFeatures } from "../../models/PlanFeatures";
import { Feature } from "../../models/Feature";
import { IAssignedFeature } from "../../models/interfaces/assigned-feature.interface";
import { IFeatureDto } from "../../dto/plan/feature.dto";

const router = express.Router();

router.put(
  "/api/plan/:planId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;
      const { planId } = req.params;

      const plan = await Plan.findById(new mongoose.Types.ObjectId(planId));
      if (!plan) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No Plan found with provided information",
              [],
              404
            )
          );
      }

      const body: CreatePlanDto = req.body;
      const {
        name,
        price,
        description,
        subscriptionType,
        assignedFeatures,
        isActive,
        isPromotionalPlan,
        promotionalPricing,
      } = body;

      if (price <= 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Price should be greater than 0", [], 400)
          );
      }

      if (!name || name.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Plan name is required", [], 400));
      }

      if (!description || description.trim().length === 0) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Description is required", [], 400));
      }

      if (
        isPromotionalPlan &&
        (!promotionalPricing || promotionalPricing?.length === 0)
      ) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Promotional pricing is required for promotional plans",
              [],
              400
            )
          );
      }

      if (!assignedFeatures || assignedFeatures.length === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "Atleast one feature assignment is required",
              [],
              400
            )
          );
      }

      const features = await Feature.find({ isActive: true }).select(
        "_id name code"
      );
      if (!features || features.length === 0) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(
              true,
              "No features found in setup. Please contact GateKipa support",
              [],
              400
            )
          );
      }

      const resolvedAssignedFeatures: IAssignedFeature[] = [];
      for (const assignedFeature of assignedFeatures) {
        const dbFeature = features.find(
          (feature) => feature._id.toString() === assignedFeature.feature
        );

        let featureItem: IFeatureDto | null = null;

        if (dbFeature) {
          featureItem = {
            featureId: dbFeature._id.toString(),
            name: dbFeature.name,
            code: dbFeature.code,
          };
        }

        let subFeatureItems: IFeatureDto[] = [];

        for (const subFeature of assignedFeature.subFeature) {
          features.map((feature) => {
            if (feature._id.toString() === subFeature) {
              subFeatureItems.push({
                featureId: feature._id.toString(),
                name: feature.name,
                code: feature.code,
              });
            }
          });
        }
        resolvedAssignedFeatures.push({
          feature: featureItem,
          subFeature: subFeatureItems,
        });
      }

      const updatedPlan = await Plan.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(planId),
        },
        {
          $set: {
            planName: name,
            price,
            description,
            subscriptionType,
            isActive,
            isPromotionalPlan,
            promotionalPricing,
            updatedBy: new mongoose.Types.ObjectId(appUserId),
          },
        },
        {
          new: true,
        }
      );

      const planObj = updatedPlan.toObject();

      const updatedPlanFeatures = await PlanFeatures.findOneAndUpdate(
        {
          plan: new mongoose.Types.ObjectId(planId),
        },
        {
          $set: {
            assignedFeatures: resolvedAssignedFeatures,
            updatedBy: new mongoose.Types.ObjectId(appUserId),
          },
        },
        {
          new: true,
        }
      );

      const planFeaturesObj = updatedPlanFeatures.toObject();

      return res.status(200).send(
        new ApiResponseDto(
          false,
          "Plan updated successfully",
          {
            ...planObj,
            assignedFeatures: planFeaturesObj.assignedFeatures,
          },
          200
        )
      );
    } catch (error) {
      console.error("Error occurred during update-plan", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while updating plan",
            [],
            500
          )
        );
    }
  }
);

export { router as updatePlanRouter };
