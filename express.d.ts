import { CreatePlanDto } from "./src/dto/plan/create-plan.dto";
import { CreateDiscountDto } from "./src/dto/discount/create-discount.dto";
import { DiscountEmailDto } from "./src/dto/discount/discount-email.dto";
import { ConfirmPaymentDto } from "./src/dto/payment/confirm-payment.dto";

declare global {
  namespace Express {
    interface Request {
      body:
        | CreatePlanDto
        | CreateDiscountDto
        | DiscountEmailDto
        | ConfirmPaymentDto;
    }
  }
}
