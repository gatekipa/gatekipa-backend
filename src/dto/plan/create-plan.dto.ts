import { IAssignedFeatureDto } from "./assigned-feature.dto";
import { IPromotionalPricingDto } from "../../models/interfaces/promotional-pricing.interface";

export class CreatePlanDto {
  name: string;
  description: string;
  price: number;
  subscriptionType: "MONTHLY" | "YEARLY";
  assignedFeatures: IAssignedFeatureDto[];
  promotionalPricing: IPromotionalPricingDto[];
  isActive: boolean;
  isPromotionalPlan: boolean;
}
