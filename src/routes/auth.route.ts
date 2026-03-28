import { Router } from 'express';
import { login, sign_up } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/signup',sign_up)

export default router;
