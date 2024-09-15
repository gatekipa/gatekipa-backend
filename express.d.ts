import { CreatePlanDto } from "./src/dto/plan/create-plan.dto";
import { CreateDiscountDto } from "./src/dto/discount/create-discount.dto";

declare global {
  namespace Express {
    interface Request {
      body: CreatePlanDto | CreateDiscountDto;
    }
  }
}
