import { ApiResponseDto } from "../api-response.dto";

export class AuthResponseDto {
  constructor(response: ApiResponseDto, token: Object) {
    this.response = response;
    this.token = token;
  }
  response: ApiResponseDto;
  token: Object;
}
