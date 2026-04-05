import { Request } from 'express';
import multer from 'multer';

// เก็บไฟล์ไว้ใน Memory ชั่วคราว (Buffer) เพื่อส่งต่อไปยัง S3
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // จำกัดขนาดไฟล์ที่ 50MB (เผื่อสำหรับไฟล์วิดีโอ)
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // รับเฉพาะไฟล์รูปภาพและวิดีโอเท่านั้น
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image and video files are allowed!'));
    }
  },
});