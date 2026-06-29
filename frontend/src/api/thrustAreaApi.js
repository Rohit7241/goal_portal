import axiosInstance from "./axiosInstance"

export const getAllThrustAreasApi = () => axiosInstance.get("/thrust-areas")
export const createThrustAreaApi = (name) => axiosInstance.post("/thrust-areas/create", { name })
export const updateThrustAreaApi = (id, name) => axiosInstance.put(`/thrust-areas/${id}`, { name })
export const deleteThrustAreaApi = (id) => axiosInstance.delete(`/thrust-areas/${id}`)