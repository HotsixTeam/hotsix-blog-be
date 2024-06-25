import { Router } from 'express';
import { createUser, getUser, loginUser, logoutUser, checkSession } from '../controllers/user';

const router = Router();

router.post('/users', createUser);
router.get('/users/:id', getUser);
router.post('/users/login', loginUser);
router.post('/users/logout', logoutUser);
// 세션 유효성 확인 라우트 추가
router.get('/check-session', checkSession);

export default router;