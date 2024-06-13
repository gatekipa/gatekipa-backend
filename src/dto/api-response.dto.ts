export class ApiResponseDto {
  constructor(
    isError: Boolean,
    message: String,
    data: any,
    responseCode: Number
  ) {
    this.data = data;
    this.isError = isError;
    this.message = message;
    this.responseCode = responseCode;
  }

  isError: Boolean;
  message: String;
  data: any;
  responseCode: Number;
}
