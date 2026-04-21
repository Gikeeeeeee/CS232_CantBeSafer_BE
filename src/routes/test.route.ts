import { Router } from 'express';
import { testSendNotification, testSubscribeTopic } from '../controllers/test.controller';
import { verifytoken } from '../middlewares/authMiddleware';

const router = Router();

// POST /test/send-notification
router.post('/send-notification', verifytoken, testSendNotification);

// POST /test/subscribe
router.post('/subscribe', verifytoken, testSubscribeTopic);

export default router;