import { ApiResponseDto } from "../dto/api-response.dto";
import { Request, Response, NextFunction } from "express";

const globalErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);
  res.status(500).send(new ApiResponseDto(true, error.message, [], 500));
};

export default globalErrorMiddleware;
