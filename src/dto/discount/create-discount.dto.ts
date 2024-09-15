export class CreateDiscountDto {
  code: string;
  maxNoUsage: number;
  discountType: "FLAT" | "PERCENTAGE";
  discountValue: number;
  isActive: boolean;
  expiryDate: Date;
}
