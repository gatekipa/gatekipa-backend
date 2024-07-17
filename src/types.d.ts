import { Request } from "express";

interface ExtendedRequest extends Request {
  user?: any; // Assuming UserPayload is defined elsewhere
}

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Assuming UserPayload is defined elsewhere
  }
}
