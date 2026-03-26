import pool from "../config/db";

export const findUserByUsername = async (username: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    return result.rows[0] || null;
}
