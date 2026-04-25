import { Request, Response } from 'express';
import { handleGetAdminActiveMap, handleUpdateReportStatus } from '../services/adminReport.service';

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

        const data = await handleUpdateReportStatus(parseInt(id), status, urgency_score, adminId);

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

