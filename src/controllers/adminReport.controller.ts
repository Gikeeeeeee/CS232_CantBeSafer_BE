import { Request, Response } from 'express';
import { handleGetAdminActiveMap } from '../services/adminReport.service';

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
