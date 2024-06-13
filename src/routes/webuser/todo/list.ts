import express, { Request, Response } from "express";
import { Todo } from "../../../models/Todo";
import { ApiResponseDto } from "../../../dto/api-response.dto";
import { requireAuth } from "../../../middlewares/require-auth.middleware";

const router = express.Router();

router.get("/api/todo", requireAuth, async (req: Request, res: Response) => {
  try {
    //const todoId = req.params.todoId;
    //const todos = await Todo.findById(todoId);
    //console.log("todoId", todoId);
    const todos = await Todo.find();
    return res
      .status(200)
      .send(
        new ApiResponseDto(false, `Records fetched successfully`, todos, 200)
      );
  } catch (error) {
    console.error("Error occurred in todoListRouter", error);
    return res
      .status(500)
      .send(new ApiResponseDto(true, `${error.message}`, [], 500));
  }
});

export { router as todoListRouter };
