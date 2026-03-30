import pool from "../config/db";

export const createReportInDB = async (reportData: {
    title: string,
    description: string,
    urgency_score: number,
    latitude: number,
    longitude: number,
    image_url: string,
    reported_by: number // ID ของ User จาก Token
}) => {
    const { title, description, urgency_score, latitude, longitude, image_url, reported_by } = reportData;
    
    const result = await pool.query(
        `INSERT INTO reports (report_title, report_description, urgency_score, latitude, longitude, image_url, reported_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,  
        [title, description, urgency_score, latitude, longitude, image_url, reported_by]
    );
    
    return result.rows[0];
};