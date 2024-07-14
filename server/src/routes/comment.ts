// routes/comment.ts
import { Router } from "express";
import { body, param } from "express-validator";
import { authenticateUser } from "../middlewares/auth";
import { validate } from "../utills/validation";
import { createComment, getComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/comment";

const router = Router();

router.post(
  "/",
  authenticateUser,
  body("content").notEmpty().withMessage("댓글 내용을 입력하세요."),
  body("postId").isInt().withMessage("유효한 게시물 ID를 입력하세요."),
  validate,
  createComment
);

router.get("/:id", authenticateUser, param("id").isInt().withMessage("유효한 댓글 ID를 입력하세요."), validate, getComment);

router.get("/post/:postId", authenticateUser, param("postId").isInt().withMessage("유효한 게시물 ID를 입력하세요."), validate, getCommentsByPost);

router.patch(
  "/:id",
  authenticateUser,
  param("id").isInt().withMessage("유효한 댓글 ID를 입력하세요."),
  body("content").notEmpty().withMessage("댓글 내용을 입력하세요."),
  validate,
  updateComment
);

router.delete("/:id", authenticateUser, param("id").isInt().withMessage("유효한 댓글 ID를 입력하세요."), validate, deleteComment);

export default router;
