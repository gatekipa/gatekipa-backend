import express, { Request, Response } from "express";
import { ApiResponseDto } from "../../dto/api-response.dto";
import { AuthenticatorService } from "../../services/authenticator";

const router = express.Router();

router.post("/api/users/signin", async (req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;

    const authService: AuthenticatorService = new AuthenticatorService();

    const { response, token } = await authService.loginUser(
      emailAddress,
      password
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(response.responseCode).send(response);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(new ApiResponseDto(true, error.message, [], 500));
  }
});

export { router as signinRouter };
