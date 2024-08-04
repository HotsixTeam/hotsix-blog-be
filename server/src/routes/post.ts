import { Router } from "express";
import { getPosts, createPost, getPostById, deletePostById, updatePostById, getUserPost, searchPostByKeyword } from "../controllers/post";
import { addLike, getLike, removeLike } from "../controllers/like";
import { authenticateUser } from "../middlewares/auth";
import { param } from "express-validator";
import { validate, validatePostId, validateSearch } from "../utills/validation";

const router = Router();

router.get("/search", authenticateUser, validateSearch, validate, searchPostByKeyword);

router.get("/user/:userId", param("userId").isInt().withMessage("유효한 사용자 ID를 입력하세요."), validate, getUserPost);

router
  .route("/:id/like")
  .post(authenticateUser, validatePostId, validate, addLike)
  .delete(authenticateUser, validatePostId, validate, removeLike)
  .get(validatePostId, validate, getLike);

router
  .route("/:id")
  .get(validatePostId, validate, getPostById)
  .delete(authenticateUser, validatePostId, validate, deletePostById)
  .patch(authenticateUser, validatePostId, validate, updatePostById);

router.route("/").get(getPosts).post(authenticateUser, createPost);

export default router;
