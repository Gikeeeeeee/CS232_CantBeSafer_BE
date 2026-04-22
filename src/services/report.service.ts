import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { LocationClient, SearchPlaceIndexForPositionCommand } from "@aws-sdk/client-location";

//npm install @aws-sdk/client-s3
//npm install @aws-sdk/client-location
//npm install multer
//npm install -D @types/multer

// ตั้งค่าการเชื่อมต่อกับ AWS
const s3Config: any = {
  region: process.env.AWS_REGION,
};

// Mock
if (process.env.NODE_ENV === 'development') {
    const mockend = process.env.MOCK_ENDPOINT;
  if (!mockend) {
    throw new Error("MOCK_ENDPOINT is missing in the .env file for development.");
  }
  s3Config.endpoint = mockend; // เช่น http://127.0.0.1:4566
  s3Config.forcePathStyle = true; // บังคับให้ใช้ path style สำหรับ LocalStack
  // For LocalStack, credentials can be anything, but it's good practice to provide them
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined, // LocalStack usually doesn't need session token
  };
}
// Real Test
if (process.env.NODE_ENV === 'production') {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.AWS_SESSION_TOKEN as string,  // ← Add this
  };
}

const s3Client = new S3Client(s3Config);

// ตั้งค่า Location Client (ใช้ Credentials เดียวกับ S3 ได้เลย)
const locationClient = new LocationClient({
  region: process.env.AWS_REGION,
  credentials: s3Config.credentials
});

export const getPlaceNameFromCoordinates = async (lat: number, lng: number) => {
  try {
    const command = new SearchPlaceIndexForPositionCommand({
      IndexName: process.env.AWS_LOCATION_PLACE_INDEX_NAME, // ชื่อ Place Index ที่ตั้งไว้ใน AWS
      Position: [lng, lat], // AWS Location ใช้ลำดับเป็น [Longitude, Latitude]
      MaxResults: 1, // เอาแค่ผลลัพธ์ที่แม่นยำที่สุดอันเดียว
    });
    const response = await locationClient.send(command);
    
    if (response.Results && response.Results.length > 0) {
      return response.Results[0].Place?.Label || "Unknown Location";
    }
    return "Unknown Location";
  } catch (error) {
    console.error("AWS Location Error:", error);
    return "Location unavailable";
  }
};

export const uploadToS3 = async (file: Express.Multer.File) => {
  const bucketName = process.env.AWS_S3_EVIDENCE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_S3_EVIDENCE_BUCKET_NAME is missing in the .env file.");
  }

  console.log("found Bucket Name:", bucketName);
  const fileName = `${Date.now()}-${file.originalname}`; // ตั้งชื่อไฟล์ใหม่กันชื่อซ้ำ
  console.log("found File Name:", fileName);
  
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
      return `${process.env.MOCK_ENDPOINT}/${process.env.AWS_S3_EVIDENCE_BUCKET_NAME}/${fileName}`;
  }
  console.log("Mode: Production (Using Real AWS)");
  // ส่ง URL ของรูปกลับไปเพื่อให้บันทึกลง Database
  return `https://${process.env.AWS_S3_EVIDENCE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};





import { createReportInDB, createBoundaryInDB, createStatusLogInDB } from "../models/ReportModel";

export const handleCreateReport = async (reqbody: any, userId: number) => {


    const report = await createReportInDB({
        title: reqbody.report_title,
        description: reqbody.report_description,
        urgency_score: reqbody.urgency_score,
        latitude: reqbody.location.latitude,
        longitude: reqbody.location.longitude,
        reported_by: userId,
        report_status: 'reported' // จัดการค่า Default ที่ Service
    });

    // 1. สร้างข้อมูลขอบเขต (Boundary) ของ Report
    const boundary = await createBoundaryInDB({
        report_id: report.report_id,
        radius: 0.67 // ใช้ค่าจากหน้าบ้าน หรือค่าเริ่มต้นคือ 0.0
    });

    // 2. บันทึกประวัติสถานะ (Status Log) ครั้งแรกตอนตั้งโพสต์
    await createStatusLogInDB({
        report_id: report.report_id,
        old_status: null, // ครั้งแรกยังไม่มีสถานะก่อนหน้า
        new_status: 'reported',
        updated_by: userId
    });

    // เรียกใช้ฟังก์ชันแปลงพิกัดเป็นชื่อสถานที่
    //const placeName = await getPlaceNameFromCoordinates(reqbody.location.latitude, reqbody.location.longitude);
    const placeName = "tu_area_somewhere";
    // แนบชื่อสถานที่ส่งกลับไปพร้อมกับข้อมูล Report
    return { 
        ...report, 
        location_name: placeName,
        radius: boundary.radius
    };
};


import { createEvidenceInDB } from "../models/ReportModel";

export const handleCreateEvidence = async (reqbody: any, userId: number) => {
    if(!reqbody.report_id || !reqbody.file_url){
      throw new Error("Error at handleCreateEvidence in report.service maybe no report_id or file_url");
    }
    const evidence = await createEvidenceInDB({
        report_id: reqbody.report_id,
        file_url: reqbody.file_url,
        file_type: reqbody.file_type,
        uploaded_by: userId,
        latitude: reqbody.location?.latitude,
        longitude: reqbody.location?.longitude
    });
    return evidence;
};

// ลอง test กับ local => run ได้ปกติ
export const uploadToRDS = async (data: any, userId: number) => {
    const report = await handleCreateReport(data, userId);

    const evidence = await handleCreateEvidence({
        report_id: report.report_id,
        file_url: data.evidence_url, // URL ที่ได้จาก S3
        file_type: data.file_type || 'image/jpeg',
        location: data.location // ใช้พิกัดเดียวกันกับ report
    }, userId);

    return {
        report_id: report.report_id,
        report_title: report.report_title,
        report_status: report.report_status,
        evidence_url: evidence.file_url,
        location_name: report.location_name,
        radius: report.radius
    };
};