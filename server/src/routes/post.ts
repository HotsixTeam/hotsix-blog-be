import { Router } from 'express'
import { 
    getPosts, 
    createPost, 
    getPostById, 
    deletePostById, 
    updatePostById } from '../controllers/post'

const router = Router();

router.route('/')
    .get(getPosts)
    .post(createPost)

router.route('/:id')
    .get(getPostById) // 게시글 상세 조회
    .delete(deletePostById) // 게시글 삭제
    .patch(updatePostById) // 게시글 수정

export default router;