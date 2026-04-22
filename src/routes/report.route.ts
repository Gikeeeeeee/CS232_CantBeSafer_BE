import { Router } from 'express';
import { uploadReportEvidence, postReport,uploadReportToDB } from '../controllers/report.controller';
import { upload } from '../middlewares/reportMiddleware';
import * as LocationController from '../controllers/location.controller';

import { verifytoken } from '../middlewares/authMiddleware'; 

const router = Router();

// ใส่ upload.single('file') เพื่อบอกว่าชื่อฟิลด์ในฟอร์มคือ 'file' (รับได้ทั้งไฟล์รูปและวิดีโอ)
// เพิ่ม verifytoken เพื่อป้องกันไม่ให้คนนอกอัปโหลดไฟล์ขยะเข้ามาได้

// 2. User ส่งข้อมูลรายงาน (พิกัด + รายละเอียด + URL รูป/วิดีโอ)
router.post('/post', verifytoken, postReport);
router.post('/postevidence', verifytoken, upload.single('file'), uploadReportEvidence);
router.post('/post-todb', verifytoken, uploadReportToDB);

router.get('/active-map', LocationController.getActiveIncidentPoints);
export default router;