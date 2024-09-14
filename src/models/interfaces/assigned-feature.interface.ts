import { IFeatureDto } from "../../dto/plan/feature.dto";

export interface IAssignedFeature {
  feature: IFeatureDto;
  subFeature: IFeatureDto[];
}
