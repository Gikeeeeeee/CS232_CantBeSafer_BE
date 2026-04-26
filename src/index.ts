import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors({
  origin: 'YOUR_FE_URL', // ต้องระบุ endpoint ให้ตรงนะไม่งั้นหน้าบ้านยิง api เข้ามาไม่ได้
  credentials: true,               // อนุญาตให้ส่ง Cookie / Token ได้
}));
app.use(express.json()); // Parse incoming JSON requests

import authRouter from './routes/auth.route';
import reportRouter from './routes/report.route';
import testRouter from './routes/test.route';

// Conditional Swagger UI setup - only in development
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger').default;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));
  console.log('✅ Swagger UI enabled at /api-docs');
}

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
