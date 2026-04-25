import { Request, Response } from 'express';
import { sendEmailAndCreateNotification, subscribeUserToTopic } from '../services/notification.service';
import pool from '../config/db'; // Import pool เพื่อใช้ query หา user_id
import { AuthRequest } from '../middlewares/authMiddleware';

export const testSendNotification = async (req: AuthRequest, res: Response) => {
    try {
        // --- Hardcoded Authorization Logic (จาก isAdmin middleware) ---
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only administrators can perform this action." });
        }
        // --- End Hardcoded Authorization Logic ---

        const { email, message, subject, report_id } = req.body;

        if (!email || !message) {
            return res.status(400).json({ message: "Email and message are required in the request body." });
        }

        // ค้นหา user_id จาก email ที่ส่งมาใน request body
        const userResult = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found.` });
        }

        const notification = await sendEmailAndCreateNotification(
            user.user_id,
            report_id || null, // report_id สามารถเป็น null ได้
            message,
            subject || "Test Notification from CantBeSafer"
        );

        res.status(200).json({ message: "Test notification sent and recorded successfully.", notification });
    } catch (error: any) {
        console.error("Error in testSendNotification:", error);
        res.status(500).json({ message: "Failed to send test notification.", error: error.message });
    }
};

export const testSubscribeTopic = async (req: AuthRequest, res: Response) => {
    try {
        // --- Hardcoded Authorization Logic (Admin only) ---
        if (!req.user || req.user.role == 'admin') {
            return res.status(403).json({ message: "Access denied. Only administrators can perform this action." });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required in the request body." });
        }

        const response = await subscribeUserToTopic(email);
        res.status(200).json({ message: "Subscription request sent successfully.", response });
    } catch (error: any) {
        console.error("Error in testSubscribeTopic:", error);
        res.status(500).json({ message: "Failed to send subscription request.", error: error.message });
    }
};