import Goal from "../models/Goal.js";
import User from "../models/User.model.js";
import GoalApproval from "../models/GoalApproval.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AuditLog from "../models/AuditLog.js"
const getTeamGoals=asyncHandler(async(req,res)=>{
    const manager_id=req.user._id;
    const employees=await User.find({manager_id})
    if(employees.length==0){
       throw new ApiError(200,"No employees Under You")
    }
    const employeeIds=employees.map(emp=>emp._id)
    const goals=await Goal.find({
        employee_id:{$in:employeeIds},
        status:"Submitted"
    })
    .populate("employee_id","name email department")
    .populate("thrust_id","name")
    .sort({createdAt: -1})
    return res.status(200).json(
        new ApiResponse(200,goals,"Team Goals fetched!")
    )
})
const approveGoal= asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const manager_id=req.user._id
    const goal=await Goal.findById(goal_id)
    .populate("employee_id")
    if(!goal){
        throw new ApiError(404,"Goal not found")
    }

    if(goal.employee_id.manager_id.toString()!==manager_id.toString()){
        throw new ApiError(403,"Not authorized to approve this Goal")
    }

    if(goal.status!=="Submitted"){
        throw new ApiError(400,"Only Submitted goals can be approved")
    }
    goal.status="locked"
    await goal.save()
    await GoalApproval.create({
        goal_id,manager_id,action:"approved"
    })
    return res.status(200).json(
        new ApiResponse(200,goal,"goal approved and locked")
    )
})
const returnGoal=asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const manager_id=req.user._id
    const {comment}=req.body
    if(!comment){
        throw new ApiError(400,"please provide a reason for returning the goal")
    }
    const goal=await Goal.findById(goal_id)
    .populate("employee_id")
    if(!goal){
        throw new ApiError(404,"Goal not found")
    }
    if(goal.employee_id.manager_id.toString()!==manager_id.toString()){
        throw new ApiError(403,"Not authorized")
    }
    if(goal.status!=="Submitted"){
        throw new ApiError(400,"Only Submitted goals can be returned")
    }
    goal.status="draft"
    await goal.save()
    await GoalApproval.create({
        goal_id,
        manager_id,
        action:"returned",
        comment
    })
    return res.status(200).json(
        new ApiResponse(200,goal,"Goal returned for rework")
    )
})
const editGoalBeforeApproval=asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const manager_id=req.user._id
    const {target_value,weightage}=req.body
    const goal=await Goal.findById(goal_id)
    .populate("employee_id")
    if(!goal){
        throw new ApiError(404,"Goals not found")
    }
    if(goal.employee_id.manager_id.toString()!==manager_id.toString()){
        throw new ApiError(403,"Not authorized")
    }
    if(goal.status!=="Submitted"){
        throw new ApiError(400,"Can only edit Submitted Goals")
    }
    if(weightage&&weightage<10){
        throw new ApiError(400,"weightage cannot be less than 10%")
    }
    const updatedGoal=await Goal.findByIdAndUpdate(
        goal_id,{
            $set:{
                ...(target_value&&{target_value}),
                ...(weightage&&{weightage})
            }
        },
        {new:true}
    )
    await AuditLog.create({
        goal_id,
        changed_by:manager_id,
        field_changed:"target_value/weightage",
        old_value:`${goal.target_value}/${goal.weightage}`,
        new_value:`${target_value}/${weightage}`
    })
    return res.status(200).json(
        new ApiResponse(200,updatedGoal,"Goal Updated")
    )
})

export {getTeamGoals,approveGoal,returnGoal,editGoalBeforeApproval}