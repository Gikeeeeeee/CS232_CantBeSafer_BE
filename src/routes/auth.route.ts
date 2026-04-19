import { Router } from 'express';
import { login, sign_up, loginDev } from '../controllers/auth.controller';
import { checkRole, verifytoken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/login-dev', loginDev);
router.post('/signup',sign_up)

export default router;
