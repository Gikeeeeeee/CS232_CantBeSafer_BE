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
            r.report_description,
            b.radius, 
            r.created_at,
            COALESCE(
                (SELECT JSON_AGG(ev) 
                 FROM (
                     SELECT evidence_id, file_url, file_type, latitude, longitude, created_at 
                     FROM report_evidences 
                     WHERE report_id = r.report_id
                 ) ev
                ), '[]'
            ) AS evidences
        FROM reports r
        LEFT JOIN report_boundaries b ON r.report_id = b.report_id
        WHERE r.report_status IN ('in_progress', 'reported')
        ORDER BY r.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const updateReportStatusInDB = async (report_id: number, status: string, urgency_score: number) => {
    const query = `
        UPDATE reports 
        SET 
            report_status = $1, 
            urgency_score = $2, 
            updated_at = NOW(),
            complete_at = CASE WHEN $4 = 'resolved' THEN NOW() ELSE complete_at END
        WHERE report_id = $3
        RETURNING *
    `;
    const result = await pool.query(query, [status, urgency_score, report_id, status]);
    return result.rows[0];
};



