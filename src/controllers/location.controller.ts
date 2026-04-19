import { Request, Response } from 'express';
import * as SpatialService from '../services/spatial.service';

export const getActiveIncidentPoints = async (req: Request, res: Response) => {
    try {
        // เรียก Service ที่จัดการเรื่องการคำนวณพื้นที่และพิกัด
        const points = await SpatialService.getMapPoints();
        
        return res.status(200).json({
            success: true,
            count: points.length,
            data: points
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Spatial Query Error" });
    }
};