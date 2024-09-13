import { Request } from "express";

interface ExtendedRequest extends Request {
  user?: any;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
