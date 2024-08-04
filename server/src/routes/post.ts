import { Router } from "express";
import { getPosts, createPost, getPostById, deletePostById, updatePostById, getUserPost } from "../controllers/post";
import { addLike, getLike, removeLike } from "../controllers/like";
import { authenticateUser } from "../middlewares/auth";
import { param } from "express-validator";
import { validate, validatePostId } from "../utills/validation";

const router = Router();

router.route("/").get(getPosts).post(createPost);
router.get("/user/:userId", param("userId").isInt().withMessage("유효한 사용자 ID를 입력하세요."), validate, getUserPost);

router
  .route("/:id")
  .get(validatePostId, validate, getPostById)
  .delete(authenticateUser, validatePostId, validate, deletePostById)
  .patch(authenticateUser, validatePostId, validate, updatePostById);

router
  .route("/:id/like")
  .post(authenticateUser, validatePostId, validate, addLike)
  .delete(authenticateUser, validatePostId, validate, removeLike)
  .get(authenticateUser, validatePostId, validate, getLike);

export default router;
