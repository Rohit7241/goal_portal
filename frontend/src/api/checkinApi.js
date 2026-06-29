import axiosInstance from "./axiosInstance"

export const getActiveWindowApi = () => axiosInstance.get("/checkin/active-window")
export const submitCheckinApi = (data) => axiosInstance.post("/checkin/submit", data)
export const getMyCheckinsApi = (quarter, year) => axiosInstance.get(`/checkin/my-checkins?quarter=${quarter}&year=${year}`)