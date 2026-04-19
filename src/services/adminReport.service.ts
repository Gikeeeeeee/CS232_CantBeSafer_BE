import { getAdminActiveMapReportsInDB } from "../models/adminReport.model";

export const handleGetAdminActiveMap = async () => {
    const reports = await getAdminActiveMapReportsInDB();
    
    const formattedData = reports.map((report: any) => ({
        report_id: report.report_id,
        report_title: report.report_title,
        report_status: report.report_status,
        urgency_score: report.urgency_score,
        location: {
            latitude: report.latitude,
            longitude: report.longitude
        },
        radius: report.radius,
        created_at: report.created_at
    }));

    return formattedData;
};
