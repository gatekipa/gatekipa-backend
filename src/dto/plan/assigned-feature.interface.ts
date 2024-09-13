import { IFeature } from "./feature.interface";

export interface IAssignedFeature {
  feature: IFeature;
  subFeature: IFeature[];
}
