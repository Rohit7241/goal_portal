import axiosInstance from "./axiosInstance"

export const createWindowApi = (data) => axiosInstance.post("/admin/windows/create", data)
export const activateWindowApi = (id) => axiosInstance.put(`/admin/windows/${id}/activate`)
export const deactivateWindowApi = (id) => axiosInstance.put(`/admin/windows/${id}/deactivate`)
export const getAllWindowsApi = () => axiosInstance.get("/admin/windows")
export const unlockGoalApi = (id, reason) => axiosInstance.put(`/admin/goals/${id}/unlock`, { reason })
export const shareGoalApi = (data) => axiosInstance.post("/admin/goals/share", data)