import { SNSClient, PublishCommand, SubscribeCommand } from "@aws-sdk/client-sns";
import { createNotificationInDB } from "../models/NotificationModel";
import { getAllUsers } from "../models/UserModel";

// ตั้งค่าการเชื่อมต่อกับ AWS
const snsConfig: any = {
    region: process.env.AWS_REGION,
};

// Mock สำหรับโหมด Development (เช่นใช้ LocalStack)
if (process.env.NODE_ENV === 'development') {
    const mockend = process.env.MOCK_ENDPOINT;
    if (!mockend) {
        console.warn("MOCK_ENDPOINT is missing in the .env file for development.");
    }
    snsConfig.endpoint = mockend; // เช่น http://127.0.0.1:4566
    snsConfig.credentials = {
        accessKeyId: 'test',
        secretAccessKey: 'test',
        sessionToken: 'test',
    };
}

// Production สำหรับของจริง
if (process.env.NODE_ENV === 'production') {
    snsConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN as string,
    };
}

const snsClient = new SNSClient(snsConfig);

/**
 * ส่งข้อความผ่าน AWS SNS (เข้า Topic) และบันทึกข้อมูลลงตาราง notifications
 */
export const sendEmailAndCreateNotification = async (
    user_id: number,
    report_id: number | null,
    message: string,
    subject: string = "CantBeSafer Notification"
) => {
    try {
        // 1. ส่ง Notification ผ่าน AWS SNS ไปยัง Topic
        const topicArn = process.env.AWS_SNS_TOPIC_ARN;
        if (topicArn) {
            const command = new PublishCommand({
                TopicArn: topicArn,
                Subject: subject,
                Message: message,
            });
            await snsClient.send(command);
            console.log(`[SNS] Successfully published to ${topicArn}`);
        } else {
            console.warn("[SNS] AWS_SNS_TOPIC_ARN is not defined in .env. Skipping SNS publish.");
        }

        // 2. สร้าง Entity ในฐานข้อมูล (ตาราง notifications)
        const notification = await createNotificationInDB({ user_id, report_id, message });
        return notification;
    } catch (error) {
        console.error("Error in sendEmailAndCreateNotification:", error);
        throw error;
    }
};

/**
 * ร้องขอการ Subscribe อีเมลเข้ากับ SNS Topic (ส่งคำขอไปยังอีเมลเพื่อให้ผู้ใช้กดยืนยัน)
 */
export const subscribeUserToTopic = async (email: string) => {
    try {
        const topicArn = process.env.AWS_SNS_TOPIC_ARN;
        if (!topicArn) {
            throw new Error("AWS_SNS_TOPIC_ARN is not defined in .env");
        }

        const command = new SubscribeCommand({
            TopicArn: topicArn,
            Protocol: "email", // ระบุว่าเป็นการส่งเข้า Email
            Endpoint: email,   // อีเมลปลายทางที่ต้องการให้รับแจ้งเตือน
        });

        const response = await snsClient.send(command);
        console.log(`[SNS] Subscription request sent to ${email}. SubscriptionArn: ${response.SubscriptionArn}`);
        return response;
    } catch (error) {
        console.error("Error in subscribeUserToTopic:", error);
        throw error;
    }
};

/**
 * ส่งการแจ้งเตือนไปยังผู้ใช้ทุกคนในระบบ
 */
export const sendNotificationToAllUsers = async (
    report_id: number | null,
    message: string,
    subject: string = "TU.Threat Notification"
) => {
    try {
        // 1. ส่ง Notification ผ่าน AWS SNS ไปยัง Topic (ถึงทุกคนที่ Subscribe Topic นี้ไว้)
        const topicArn = process.env.SNS_TOPIC_ARN;
        if (topicArn) {
            const command = new PublishCommand({
                TopicArn: topicArn,
                Subject: subject,
                Message: message,
            });
            await snsClient.send(command);
            console.log(`[SNS] Successfully published to Topic for all subscribers`);
        }

        // 2. สร้าง Entity ในฐานข้อมูลให้ทุกคน (เพื่อแสดงในหน้า In-app Notification)
        const users = await getAllUsers();

        // ใช้ Promise.all เพื่อความรวดเร็วในการบันทึกข้อมูล
        const notificationPromises = users.map(user =>
            createNotificationInDB({
                user_id: user.user_id,
                report_id,
                message
            })
        );

        await Promise.all(notificationPromises);
        console.log(`✅ In-app notifications created for ${users.length} users`);

    } catch (error) {
        console.error("Error in sendNotificationToAllUsers:", error);
        throw error;
    }
};