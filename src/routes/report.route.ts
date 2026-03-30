import { Router } from 'express';
import { uploadReportPic, postReport } from '../controllers/report.controller';
import { upload } from '../middlewares/upload.middleware';
import { verifytoken } from '../middlewares/authMiddleware'; 

const router = Router();

// ใส่ upload.single('image') เพื่อบอกว่าชื่อฟิลด์ในฟอร์มคือ 'image'
// เพิ่ม verifytoken เพื่อป้องกันไม่ให้คนนอกอัปโหลดไฟล์ขยะเข้ามาได้
router.post('/postpic', verifytoken, upload.single('image'), uploadReportPic);
router.post('/post', verifytoken, postReport);
// 2. User ส่งข้อมูลรายงาน (พิกัด + รายละเอียด + URL รูป)

export default router;