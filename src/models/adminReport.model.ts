import pool from "../config/db";

export const getAdminActiveMapReportsInDB = async () => {
    const query = `
        SELECT 
            r.report_id, 
            r.report_title, 
            r.report_status, 
            r.urgency_score, 
            r.latitude, 
            r.longitude, 
            r.address,
            b.radius, 
            r.created_at
        FROM reports r
        LEFT JOIN report_boundaries b ON r.report_id = b.report_id
        WHERE r.report_status IN ('in_progress', 'reported')
        ORDER BY r.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
};
