import axiosInstance from "./axiosInstance"

export const getTeamGoalsApi = () => axiosInstance.get("/manager/team-goals")
export const approveGoalApi = (id) => axiosInstance.put(`/manager/goals/${id}/approve`)
export const returnGoalApi = (id, comment) => axiosInstance.put(`/manager/goals/${id}/return`, { comment })
export const editGoalBeforeApprovalApi = (id, data) => axiosInstance.put(`/manager/goals/${id}/edit`, data)
export const getTeamCheckinsApi = (quarter, year) => axiosInstance.get(`/checkin/team-checkins?quarter=${quarter}&year=${year}`)
export const addCommentApi = (id, comment_text) => axiosInstance.post(`/checkin/${id}/comment`, { comment_text })