import { Request, Response } from 'express';
import { uploadToS3,handleCreateReport } from '../services/report.service';

// --- ฟังก์ชันที่ 1: อัปโหลดรูปไป S3 ---
export const uploadReportPic = async (req: Request, res: Response) => {
    try {
        // 1. ตรวจสอบว่ามีไฟล์ส่งมาไหม
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });
        
        // 2. เรียกใช้ Service เพื่อส่งรูปไป S3/LocalStack
        // req.file จะมีค่าหลังจากผ่าน multer middleware มาแล้ว
        const imageUrl = await uploadToS3(req.file as Express.Multer.File);
        
        // 3. ส่ง URL กลับไปให้หน้าบ้าน (Next.js)
        res.status(200).json({
            message: "Upload successful",
            data: { image_url: imageUrl }
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message || 'Internal server errorBRUH' });
        
    }
};

// --- ฟังก์ชันที่ 2: บันทึกข้อมูลรายงาน ---
export const postReport = async (req: any, res: Response) => {
    try {
        // ดึง userId จาก Token ที่ผ่าน Middleware verifyToken มาแล้ว
        const userId = req.user.user_id; 
        
        const report = await handleCreateReport(req.body, userId);
        
        res.status(201).json({
            message: "Incident report saved successfully",
            data: report
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};