import { Router } from "express";
import { getPosts, createPost, getPostById, deletePostById, updatePostById, getUserPost, searchPostByKeyword } from "../controllers/post";
import { addLike, getLike, removeLike } from "../controllers/like";
import { authenticateUser } from "../middlewares/auth";
import { param } from "express-validator";
import { validate, validatePostId, validateSearch } from "../utills/validation";

const router = Router();

// 검색 라우트
router.get("/search", validateSearch, validate, searchPostByKeyword);

// 특정 유저의 게시글 조회 라우트
router.get("/user/:userId", param("userId").isInt().withMessage("유효한 사용자 ID를 입력하세요."), validate, getUserPost);

// 좋아요 관련 라우트
router
  .route("/:id/like")
  .post(authenticateUser, validatePostId, validate, addLike)
  .delete(authenticateUser, validatePostId, validate, removeLike)
  .get(validatePostId, validate, getLike);

// 특정 게시글 관련 라우트
router
  .route("/:id")
  .get(validatePostId, validate, getPostById)
  .delete(authenticateUser, validatePostId, validate, deletePostById)
  .patch(authenticateUser, validatePostId, validate, updatePostById);

// 전체 게시글 조회 및 생성 라우트
router.route("/").get(getPosts).post(authenticateUser, createPost);

export default router;
