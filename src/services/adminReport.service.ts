import { getAdminActiveMapReportsInDB, updateReportStatusInDB } from "../models/adminReport.model";
import { getReportById, createStatusLogInDB } from "../models/ReportModel";

export const handleGetAdminActiveMap = async () => {
    const reports = await getAdminActiveMapReportsInDB();

    const formattedData = reports.map((report: any) => ({
        report_id: report.report_id,
        report_title: report.report_title,
        report_status: report.report_status,
        urgency_score: report.urgency_score,
        location: {
            latitude: report.latitude,
            longitude: report.longitude,
            address: report.address
        },

        radius: report.radius,
        created_at: report.created_at
    }));

    return formattedData;
};

export const handleUpdateReportStatus = async (report_id: number, status: string, urgency_score: number, admin_id: number) => {
    // 1. ตรวจสอบว่ามี Report อยู่จริงไหม
    const existingReport = await getReportById(report_id);
    if (!existingReport) {
        const error: any = new Error("Report not found");
        error.statusCode = 404;
        throw error;
    }

    // 2. อัปเดตข้อมูลในตาราง reports
    const updatedReport = await updateReportStatusInDB(report_id, status, urgency_score);

    // 3. บันทึกประวัติลงใน report_status_logs
    await createStatusLogInDB({
        report_id: report_id,
        old_status: existingReport.report_status,
        new_status: status,
        updated_by: admin_id
    });

    return {
        incidentId: updatedReport.report_id,
        title: updatedReport.report_title,
        status: updatedReport.report_status,
        urgency_score: updatedReport.urgency_score,
        updatedAt: updatedReport.updated_at
    };
};
