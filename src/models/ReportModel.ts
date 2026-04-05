import pool from "../config/db";

export const createReportInDB = async (reportData: {
    title: string,
    description: string,
    urgency_score: number,
    latitude: number,
    longitude: number,
    reported_by: number,
    report_status: string // ให้ Service เป็นคนส่งมาให้เสมอ
}) => {
    const { title, description, urgency_score, latitude, longitude, reported_by, report_status } = reportData;
    
    const result = await pool.query(
        `INSERT INTO reports (report_title, report_description, urgency_score, latitude, longitude, reported_by, report_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,  
        [title, description, urgency_score, latitude, longitude, reported_by, report_status]
    );
    
    return result.rows[0];
};

export const getReportById = async (report_id: number) => {
    const result = await pool.query('SELECT * FROM reports WHERE report_id = $1', [report_id]);
    return result.rows[0] || null; // คืนค่า null ถ้าไม่เจอ
};

export const createEvidenceInDB = async (evidenceData: {
    report_id: number,    // ได้มาจากผลลัพธ์ของ createReportInDB
    file_url: string,     // URL จาก S3
    file_type: string,    // เช่น image/png หรือ video/mp4
    uploaded_by: number,  // ID ของ User
    latitude?: number,    // ใส่หรือไม่ใส่ก็ได้ (Optional)
    longitude?: number
}) => {
    const { report_id, file_url, file_type, uploaded_by, latitude, longitude } = evidenceData;

    const result = await pool.query(
        `INSERT INTO report_evidences (report_id, file_url, file_type, uploaded_by, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [report_id, file_url, file_type, uploaded_by, latitude, longitude]
    );

    return result.rows[0];
};

export const createBoundaryInDB = async (boundaryData: {
    report_id: number,
    radius: number // เช่น 10.0 หรือ 50.0 ตามที่ตกลงกัน
}) => {
    const { report_id, radius } = boundaryData;

    const result = await pool.query(
        `INSERT INTO report_boundaries (report_id, radius)
         VALUES ($1, $2)
         RETURNING *`,
        [report_id, radius]
    );

    return result.rows[0];
};

export const createStatusLogInDB = async (logData: {
    report_id: number,
    old_status: string | null, // ครั้งแรกที่สร้างจะเป็น null
    new_status: string  ,
    updated_by: number // ID ของ Admin หรือ User ที่ดำเนินการ
}) => {
    const { report_id, old_status, new_status, updated_by } = logData;

    const result = await pool.query(
        `INSERT INTO report_status_logs (report_id, old_status, new_status, updated_by)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [report_id, old_status, new_status, updated_by]
    );

    return result.rows[0];
};