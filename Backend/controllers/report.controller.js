import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/User.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Checkin from "../models/Checkin.js";
const getAchievementReport=asyncHandler(async(req,res)=>{
    const {quarter,year,department}=req.query
    const employeeFilter={role:"employee"}
    if(department){
        employeeFilter.department=department
    }
    const employees=await User.find(employeeFilter)
    .select("name email department manager_id")

    if(employees.length==0){
        return res.status(200).json(
            new ApiResponse(200,[],"No employee found")
        )
    }

    const employeeIds=employees.map(emp=>emp._id)

    const checkinFilter={employee_id:{$in:employeeIds}}

    if(quarter)checkinFilter.quarter=quarter
    if(year)checkinFilter.year=parseInt(year)
    
    const checkins=await Checkin.find(checkinFilter)
    .populate("employee_id","name email department")
    .populate("goal_id","title uom_type target_value target_date weightage")
    .sort({createdAt:-1})

    const report=employees.map(employee=>{
        const employeeCheckins=checkins.filter(
            c=>c.employee_id._id.toString()===employee._id.toString()
        )
        return {
        employee:{
            name:employee.name,
            email:employee.email,
            department:employee.department
        },
        checkins:employeeCheckins.map(c=>({
            goal_title:c.goal_id?.title,
            quarter:c.quarter,
            year:c.year,
            target:c.goal_id?.target_value,
            actual:c.actual_value,
            score:c.score,
            status:c.status
        }))
     }
    })

    return res.status(200).json(
        new ApiResponse(200,report,"Achievement report fetched successfully")
    )
})

const getCompletionDashboard=asyncHandler(async(req,res)=>{
    const {year}=req.query
    const targetYear=parseInt(year)||new Date().getFullYear()
    const employees=await User.find({
        role:"employee"
    })
    .select("name email department")
    const checkins=await Checkin.find({year: targetYear})
    .select("employee_id quater year status")

    const quarter=["Q1","Q2","Q3","Q4"]

    const dashboard=employees.map(employee=>{
        const employeeCheckins=checkins.filter(
            c=>c.employee_id.toString()===employee._id.toString()
        )
        const quarterStatus={}
        quarters.forEach(q => {
            const found=employeeCheckins.find(c=>c.quarter===q)
            quarterStatus[q]=found?"completed":"pending"
        })
        return{
            employee:{
                name:employee.name,
                email:employee.email,
                department:employee.department
            },
            quarters:quarterStatus,
            totalCompleted:Object.values(quarterStatus).filter(s=>s==="completed").length
        }
    })
    return res.status(200).json(
        new ApiResponse(200,dashboard,"Completion dashboard fetched successfully")
    )
})


//two more functions remaining
//also explaination of second function