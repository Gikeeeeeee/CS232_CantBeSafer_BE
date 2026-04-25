import { Request, Response } from 'express';
import { handleGetAdminActiveMap, handleUpdateReportStatus } from '../services/adminReport.service';
import { sendNotificationToAllUsers } from '../services/notification.service';

export const getAdminActiveMap = async (req: Request, res: Response) => {
    try {
        const data = await handleGetAdminActiveMap();

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error: any) {
        console.error("Error in getAdminActiveMap controller:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const updateIncidentStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status, urgency_score } = req.body;
        const adminId = req.user.user_id;

        if (!status || urgency_score === undefined) {
            return res.status(400).json({
                success: false,
                message: "Status and urgency_score are required"
            });
        }

        //urgency_score ที่เป็นไปได้
        const possible_urgency_score = [1, 2, 3];
        //status ที่เป็นไปได้ reported, in_progress, resolved
        const possible_status = ["reported", "in_progress", "resolved"];

        if (!possible_urgency_score.includes(urgency_score) || !possible_status.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'urgency_score หรือ status ไม่ถูกต้อง. possible_status: 1, 2, 3 possible_urgency_score: "reported", "in_progress", "resolved" '
            });
        }

        const data = await handleUpdateReportStatus(parseInt(id), status, urgency_score, adminId);

        // ส่งการแจ้งเตือนไปยังผู้ใช้ทุกคนในระบบ
        try {
            // แปลง urgency_score เป็นข้อความ
            const urgencyText = urgency_score === 3 ? "Emergency" : urgency_score === 2 ? "Urgent" : "Normal";
            const status_text = status === "in_progress" ? "กำลังดำเนินการแก้ไข" : status === "resolved" ? "แก้ไขเรียบร้อยแล้ว" : "";

            const notificationMessage = `ประกาศ: เหตุการณ์ "${data.title}" (ระดับ: ${urgencyText}) ได้รับการอัปเดตสถานะเป็น "${status_text}"`;
            await sendNotificationToAllUsers(
                data.incidentId,
                notificationMessage,
                "อัปเดตสถานะเหตุการณ์ (TU-Threat)"
            );
            console.log(`✅ Broadcast notification sent to all users`);
        } catch (notifError) {
            console.error("❌ Failed to send broadcast notification:", notifError);
            // ไม่ต้องขัดขวางการตอบกลับหลักหากแจ้งเตือนล้มเหลว
        }

        return res.status(200).json({
            success: true,
            message: "อัปเดตสถานะเหตุการณ์เรียบร้อยแล้ว",
            data: data
        });
    } catch (error: any) {
        console.error("Error in updateIncidentStatus controller:", error);

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

