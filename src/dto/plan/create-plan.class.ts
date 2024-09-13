import { IAssignedFeature } from "./assigned-feature.interface";
import { IPromotionalPricingDto } from "./promotional-pricing.interface";

export class CreatePlanDto {
  name: string;
  description: string;
  price: number;
  subscriptionType: "MONTHLY" | "YEARLY";
  assignedFeatures: IAssignedFeature[];
  promotionalPricing: IPromotionalPricingDto[];
  isActive: boolean;
  isPromotionalPlan: boolean;
}
