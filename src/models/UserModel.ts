import pool from "../config/db";
export const findUserByUsername = async (username: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    return result.rows[0] || null;
}

export const MakeUser = async (username: string, passwordHash: string, email: string) => {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING user_id, username, email',
        [username, passwordHash, email]
    );
    return result.rows[0]; 
}
export const findUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
}