import pool from "../config/db";

export const createNotificationInDB = async (notificationData: {
    user_id: number;
    report_id?: number | null;
    message: string;
}) => {
    const { user_id, report_id, message } = notificationData;

    const result = await pool.query(
        `INSERT INTO notifications (user_id, report_id, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, report_id || null, message]
    );

    return result.rows[0];
};
