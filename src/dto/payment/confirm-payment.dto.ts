export class ConfirmPaymentDto {
  planId: string;
  discountedAmount: number;
  payableAmount: number;
  stripePayment: any;
  appliedDiscountId?: string;
}
