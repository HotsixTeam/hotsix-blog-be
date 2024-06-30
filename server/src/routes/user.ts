import { Router } from 'express';
import { createUser, getUser, loginUser, logoutUser, checkSession } from '../controllers/user';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// 세션 유효성 확인 라우트 추가
router.get('/check-session', checkSession);
router.get('/:id', getUser);

export default router;