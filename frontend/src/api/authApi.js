
import axiosInstance from "./axiosInstance";
export const loginApi=async(email,password)=>{
    const response=await axiosInstance.post("/auth/login",{email,password})
    return response.data
}
export const RegisterApi=async(email,name,password,role,department,manager_id)=>{
    const response=await axiosInstance.post("/auth/register",{email,name,password,role,department,manager_id});
    return response.data
}