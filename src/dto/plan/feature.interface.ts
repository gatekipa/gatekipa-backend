export interface IFeature {
  name: string;
  code: string;
  type: "MODULE" | "PERMISSION";
  isActive: boolean;
}
