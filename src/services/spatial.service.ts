import pool from '../config/db';

export const getMapPoints = async () => {
    const query = `
        SELECT DISTINCT ON (r.report_id) -- ป้องกันข้อมูลซ้ำ ถ้า 1 report มีหลายรูป ให้เอามาแค่รูปเดียว
            r.report_id,
            r.report_title,
            r.report_description,
            r.latitude,
            r.longitude,
            r.urgency_score,
            r.report_status,
            r.created_at,
            r.address,
            e.file_url -- ดึงมาจากตาราง report_evidences
        FROM reports r
        LEFT JOIN report_evidences e ON r.report_id = e.report_id
        WHERE 
            r.report_status = 'in_progress' 
            OR (r.report_status = 'resolved' AND r.updated_at >= NOW() - INTERVAL '1 DAY')
        ORDER BY r.report_id, r.urgency_score DESC;
    `;

    try {
        const result = await pool.query(query);

        // Map ข้อมูลให้ตรงกับที่ FE ต้องการเป๊ะๆ
        return result.rows.map(item => ({
            id: item.report_id,
            title: item.report_title,
            description: item.report_description || "",
            latitude: item.latitude,
            longitude: item.longitude,
            urgency_score: item.urgency_score,
            address: item.address,
            image_url: item.file_url || "https://via.placeholder.com/150", // ถ้าไม่มีรูปในตารางหลักฐาน ให้ใช้รูปสำรอง
            status: item.report_status === 'in_progress' ? 'NORMAL' : 'RESOLVED',
            created_at: item.created_at
        }));

    } catch (error) {
        console.error("Error (Spatial Service):", error);
        throw error;
    }
};