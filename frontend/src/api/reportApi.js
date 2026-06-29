import axiosInstance from "./axiosInstance"

export const getAchievementReportApi = (quarter, year) => axiosInstance.get(`/reports/achievement?quarter=${quarter}&year=${year}`)
export const getCompletionDashboardApi = (year) => axiosInstance.get(`/reports/completion?year=${year}`)
export const getAuditLogApi = () => axiosInstance.get("/reports/audit-log")
export const exportCSVApi = (quarter, year) => axiosInstance.get(`/reports/export?quarter=${quarter}&year=${year}`, { responseType: "blob" })