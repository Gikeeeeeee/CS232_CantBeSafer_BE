import { Request } from 'express';
import multer from 'multer';

// เก็บไฟล์ไว้ใน Memory ชั่วคราว (Buffer) เพื่อส่งต่อไปยัง S3
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาดไฟล์ที่ 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // รับเฉพาะไฟล์รูปภาพเท่านั้น
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
});