import { Router } from 'express';
import { createUser, getUser } from '../controllers/user';

const router = Router();

router.post('/user', createUser);
router.get('/user/:id', getUser);

export default router;