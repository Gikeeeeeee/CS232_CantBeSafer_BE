import { Request, Response } from 'express';
import { handleLogin, handleSignUp } from '../services/auth.service';
import { error } from 'node:console';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const accessToken = await handleLogin(username, password);

  if (!accessToken) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  return res.status(200).json({ AccessToken: accessToken });
};


export const sign_up = async (req: Request, res: Response) => {
  try {
    const { Username, Password, Confirm_pass, Email } = req.body;
    if (!Email || !Password || !Username || !Confirm_pass) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await handleSignUp(Username, Password, Confirm_pass, Email)

    return res.status(201).json({
      message: "User created successfullt",
      user: { id: user.id }
    });
  }
  catch (error: any) {
    if (error.message === "Passwords do not match") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server errorBRUH (the error maybe in docker or backend console but if u dont want to get in to, the error is) " + error + error.message });
  }

}

export const loginDev = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(
      "SELECT user_id, username, role FROM users WHERE role = 'dev' LIMIT 1"
    );

    // 2. ถ้าใน DB ยังไม่มี User ที่เป็น role 'dev' เลย
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบ User ที่มี Role เป็น 'dev' ในฐานข้อมูล กรุณาสร้าง User ก่อน"
      });
    }

    const user = result.rows[0];

    // 3. สร้าง Token โดยใช้ข้อมูลจริงจาก Database
    const accessToken = jwt.sign(
      {
        user_id: user.user_id,   // จะเปลี่ยนไปตาม ID จริงใน DB
        username: user.username,
        role: user.role
      },
      process.env.TOKEN_KEY as string,
      { expiresIn: '2h' }
    );

    console.log(`✅ Dev Login Success: Logging in as ${user.username} (ID: ${user.user_id})`);

    return res.status(200).json({ accessToken });

  } catch (error) {
    console.error("LoginDev Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};