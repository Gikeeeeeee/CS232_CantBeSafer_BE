import { Request, Response } from 'express';
import { uploadToS3, handleCreateReport, handleCreateEvidence } from '../services/report.service';
import { getReportById } from '../models/ReportModel';

// อัปโหลดไป S3 ---
export const uploadReportEvidence = async (req: any, res: Response) => {
    try {
        // 1. ตรวจสอบว่ามีไฟล์ส่งมาไหม
        console.log('Received file:', req.file);
        console.log('Received body:', req.body);
        console.log('Received user from token:', req.user);
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });
        
        // ตรวจสอบว่าส่ง report_id มาด้วยไหม (ต้องใช้เชื่อมโยงกับตาราง reports)
        if (!req.body.report_id) return res.status(400).json({ message: "report_id is required" });

        // ดึง userId จาก Token ของคนที่กำลัง Login
        const userId = req.user.user_id;

        // แปลง report_id ที่ส่งมาจาก FormData (ซึ่งเป็น String) ให้เป็นตัวเลข (Integer)
        const reportIdNum = parseInt(req.body.report_id, 10);

        // เช็คว่า Report มีอยู่จริง และเป็นของคนที่ส่งมาหรือไม่
        const report = await getReportById(reportIdNum);
        if (!report) return res.status(404).json({ message: "Report not found" });
        if (report.reported_by !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this report" });
        }

        // 2. เรียกใช้ Service เพื่อส่งรูปไป S3/LocalStack
        // req.file จะมีค่าหลังจากผ่าน multer middleware มาแล้ว
        console.log('before uploads3 File to upload:', req.file);
        const fileUrl = await uploadToS3(req.file as Express.Multer.File);
        console.log('after uploads3 File to upload:', req.file);

        // เรียกใช้ Service เพื่อบันทึกข้อมูลหลักฐานลง Database (ตาราง report_evidences)
        const evidence = await handleCreateEvidence({
            report_id: reportIdNum,
            file_url: fileUrl,
            file_type: req.file.mimetype,
            location: {
                latitude: req.body.latitude ? parseFloat(req.body.latitude) : undefined,
                longitude: req.body.longitude ? parseFloat(req.body.longitude) : undefined
            }
        }, userId);

        // 3. ส่งข้อมูลกลับไปให้หน้าบ้านตามฟอร์แมตที่ต้องการ
        res.status(200).json({
            message: "Upload successful",
            evidence_id: evidence.evidence_id,
            file_url: evidence.file_url,
            report_id: evidence.report_id
        });
    } catch (error: any) {
        // ดักจับ Error โค้ด 23503 (Foreign Key Violation) จาก PostgreSQL
        if (error.code === '23503') {
            return res.status(404).json({ message: "Report ID not found. Cannot attach evidence." });
        }

        console.error('Upload error:', error);

        const responseBody: { message: string; details?: any; debugInfo?: any } = {
            message: error.message || 'An unknown error occurred during upload.',
        };

        // ตรวจสอบว่าเป็นข้อผิดพลาดจาก AWS SDK หรือไม่ (ดูจากคุณสมบัติทั่วไปของ AWS SDK errors)
        if (error.name && error.Code) {
            responseBody.message = `AWS S3 Error: ${error.message}`;
            responseBody.details = {
                name: error.name,
                code: error.Code, // AWS SDK errors มักใช้ 'Code' (ตัวพิมพ์ใหญ่)
                statusCode: error.$metadata?.httpStatusCode,
                requestId: error.$metadata?.requestId,
                // สามารถเพิ่มคุณสมบัติอื่นๆ ที่เกี่ยวข้องได้หากต้องการ
            };
        } else {
            // สำหรับข้อผิดพลาดประเภทอื่นๆ ให้ข้อความทั่วไปแต่รวมข้อความต้นฉบับ
            responseBody.message = `Server Error: ${error.message || 'uploadReportEvidence at controller error'}`;
        }

        // สำหรับสภาพแวดล้อมที่ไม่ใช่ Production ให้ข้อมูล Debug เพิ่มเติม
        if (process.env.NODE_ENV !== 'production') {
            responseBody.debugInfo = { stack: error.stack, fullErrorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
        }

        res.status(500).json(responseBody);
        
    }
};

// บันทึกข้อมูลรายงาน ---
export const postReport = async (req: any, res: Response) => {
    try {
        // ดักจับกรณีหน้าบ้านไม่ได้ส่ง Body มา หรือส่งมาผิดประเภท (เช่นลืมเปลี่ยนเป็น JSON)
        if (!req.body || !req.body.report_title) {
            return res.status(400).json({ message: "Invalid request. Please ensure Content-Type is application/json and report_title is provided." });
        }

        // ดึง userId จาก Token ที่ผ่าน Middleware verifyToken มาแล้ว
        const userId = req.user.user_id; 
        
        const report = await handleCreateReport(req.body, userId);
        
        res.status(201).json({
            message: "Incident report saved successfully",
            
            report_id: report.report_id,
            report_title: report.report_title,
            report_description: report.report_description,
            reported_by: report.reported_by,
            urgency_score: report.urgency_score,
            report_status: report.report_status,
            location: {
                latitude: report.latitude,
                longitude: report.longitude
            },
            radius: report.radius,
            location_name: report.location_name // เพิ่ม location_name ส่งให้หน้าบ้าน
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'postReport at controller error'});
    }
};