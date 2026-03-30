import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//npm install @aws-sdk/client-s3
//npm install multer
//npm install -D @types/multer

// ตั้งค่าการเชื่อมต่อกับ AWS
// Config
const s3Config: any = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: "gike",
    secretAccessKey: "gike",
  },
};

// Mock
if (process.env.NODE_ENV === 'development') {
    const mockend = process.env.MOCK_ENDPOINT;
  if (!mockend) {
    throw new Error("MOCK_ENDPOINT is missing in the .env file.");
  }

  s3Config.endpoint = process.env.MOCK_ENDPOINT; // เช่น http://127.0.0.1:4566
  s3Config.forcePathStyle = true; // บังคับให้ใช้ path style สำหรับ LocalStack
}
// Real Test
if (process.env.NODE_ENV === 'realtest') {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  };
}

const s3Client = new S3Client(s3Config);

export const uploadToS3 = async (file: Express.Multer.File) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME is missing in the .env file.");
  }

  //console.log("fileName1");
  const fileName = `${Date.now()}-${file.originalname}`; // ตั้งชื่อไฟล์ใหม่กันชื่อซ้ำ
  //console.log("fileName2");
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,      // ข้อมูลไฟล์ที่เป็น Binary
    ContentType: file.mimetype, // ประเภทไฟล์ (jpg, png)
  });
  //console.log("Sending command to S3/LocalStack...");
  await s3Client.send(command);
  //console.log("S3 Response Status:","dadadada");

  // ตรวจสอบโหมดเพื่อส่ง Link กลับให้ถูกต้อง
  if (process.env.NODE_ENV === 'development') {
    console.log("Mode: Development (Using LocalStack)");
      return `${process.env.MOCK_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }
  console.log("Mode: Production (Using Real AWS)");
  // ส่ง URL ของรูปกลับไปเพื่อให้บันทึกลง Database
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};





import { createReportInDB } from "../models/ReportModel";

export const handleCreateReport = async (data: any, userId: number) => {

    //ว่าจะเดียวใส่ check ว่าถูกไหม

    const report = await createReportInDB({
        title: data.report_title,
        description: data.report_description,
        urgency_score: data.urgency_score,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        image_url: data.image_url,
        reported_by: userId
    });
    return report;
};