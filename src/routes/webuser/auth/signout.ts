import { AppUser } from "../../../models/AppUser";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth.middleware";

const router = express.Router();

router.post(
  "/api/users/signout",
  requireAuth,
  async (req: Request, res: Response) => {
    const { emailAddress } = req.session?.user;
    const loggedInUser = await AppUser.find({ emailAddress });

    if (loggedInUser && loggedInUser.length > 0) {
      await AppUser.findByIdAndUpdate(loggedInUser[0]._id, {
        isLoggedIn: false,
      });
    }
    req.session = null;
    res.status(200).send(new ApiResponseDto(false, "Logout Success", [], 200));
  }
);

export { router as signoutRouter };
