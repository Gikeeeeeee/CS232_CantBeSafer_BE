import { Router } from 'express';
import { uploadReportEvidence, postReport } from '../controllers/report.controller';
import { upload } from '../middlewares/reportMiddleware';
import * as LocationController from '../controllers/location.controller';
import { getAdminActiveMap, updateIncidentStatus } from '../controllers/adminReport.controller';
import { verifytoken, checkRole } from '../middlewares/authMiddleware';

const router = Router();

// 1. Admin อัปเดตสถานะเหตุการณ์
router.patch('/incidents/:id/status', verifytoken, checkRole(["admin"]), updateIncidentStatus);

// 2. User ส่งข้อมูลรายงาน (พิกัด + รายละเอียด + URL รูป/วิดีโอ)
router.post('/post', verifytoken, postReport);
router.post('/postevidence', upload.single('file'), verifytoken, uploadReportEvidence);

router.get('/active-map', LocationController.getActiveIncidentPoints);
router.get('/admin-active-map', verifytoken, checkRole(["admin"]), getAdminActiveMap);

export default router;
