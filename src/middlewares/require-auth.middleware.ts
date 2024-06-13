import { ApiResponseDto } from "../dto/api-response.dto";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userToken = req.session?.jwt;
  try {
    const payload = jwt.verify(userToken, process.env.JWT_KEY);
    if (!payload) {
      return res
        .status(401)
        .send(new ApiResponseDto(true, "Unauthorized Access", [], 401));
    }
    req.session.user = payload;
  } catch (error) {
    //console.error("Error Occurred in require-auth middleware", error);
    return res
      .status(401)
      .send(new ApiResponseDto(true, "Unauthorized Access", [], 401));
  }
  next();
};
