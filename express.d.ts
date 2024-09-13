import { CreatePlanDto } from "./src/dto/plan/create-plan.dto";

declare global {
  namespace Express {
    interface Request {
      body: CreatePlanDto;
    }
  }
}
