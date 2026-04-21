import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

import authRouter from './routes/auth.route';
import reportRouter from './routes/report.route';
import testRouter from './routes/test.route';

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Niigaa' });
});

app.use('/auth', authRouter);
app.use('/api/reports', reportRouter);
app.use('/api/test', testRouter);

// Error Handling Middleware สำหรับดักจับ Error (เช่น ไฟล์ผิดประเภทจาก Multer) ให้ตอบกลับเป็น JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
});

// Start the server
const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
