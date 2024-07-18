import { Router } from "express";
import { getPosts, createPost, getPostById, deletePostById, updatePostById, getUserPost } from "../controllers/post";
import { addLike, removeLike } from "../controllers/like";

const router = Router();

router.route("/").get(getPosts).post(createPost);
router.get("/user/:userId", getUserPost);

router
  .route("/:id")
  .get(getPostById) // 게시글 상세 조회
  .delete(deletePostById) // 게시글 삭제
  .patch(updatePostById); // 게시글 수정

router.route("/:id/like").post(addLike).delete(removeLike);
export default router;
