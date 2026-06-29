import axios from "axios";
import axiosInstance from "./axiosInstanct";

export const createGoalApi=(data)=>axiosInstance.post("/goals/create",data)
export const submitGoalApi=()=>axiosInstance.post("/goals/submit")
export const getMyGoalsApi=(status)=>axiosInstance.get(`/goals/my-goals${status?`status=${status}`:""}`)
export const editGoalApi=(id,data)=>axiosInstance.put(`/goal/${id}`,data)
export const getSingleGoalApi=(id)=>axiosInstance.get(`/goals/${id}`)

