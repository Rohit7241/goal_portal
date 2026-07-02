import Goal from "../models/Goal.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const CreateGoal=asyncHandler(async(req,res)=>{
    const {thrust_id,title,weightage,description,uom_type,target_value,target_date}=req.body;
    const employee_id=req.userid;
    const existingGoal=await Goal.countDocuments({
        employee_id
    })
    if(existingGoal>=8){
        throw new ApiError(400,"Maximum 8 goals allowed");
    }
    if(weightage<10){
        throw new ApiError(400,"minimum weightage is 10");
    }
    if(uom_type=="timeline"){
        if(!target_date){
            throw new ApiError(400,"targetdate is required");
        }
    }
    else{
        if(!target_value){
            throw new ApiError(400,"target value is required");
        }
    }
    const createdgoal=await Goal.create(
        {employee_id,thrust_id,title,description,uom_type,target_value,target_date,weightage,status:"draft"}
    )
    if(!createdgoal){
        throw new ApiError(500,"Unable to create Goal");
    }
    return res.status(200).json(
        new ApiResponse(200,createdgoal,"Goal Created Successfully")
    )
})
const SubmitGoals=asyncHandler(async(req,res)=>{
    const employee_id=req.userid;
    const draftGoals=await Goal.find({employee_id,status:"draft"});
    if(draftGoals.length==0){
        throw new ApiError(400,"No draft goals to submit");
    }
    const total=draftGoals.reduce((sum,goal)=>{
        return sum+goal.weightage
    },0)
    if(total!==100){
        throw new ApiError(400,"total weightage is not equal to 100");
    }
    const invalidGoal=draftGoals.find(goal=>goal.weightage<10);
    if(invalidGoal){
        throw new ApiError(400,"Some Goals have weightage less than 10")
    }
    if(draftGoals.length>8){
        throw new ApiError(400,"Maximum 8 goals");
    }
    await Goal.updateMany(
        {employee_id,status:"draft"},
        {$set:{status:"Submitted"}}
    )
    return res.status(200).json(
        new ApiResponse(200,draftGoals,"goals sent")
    )
})
const getMyGoals=asyncHandler(async(req,res)=>{
    const employee_id=req.userid;
    const {status}=req.query;
    const filter={employee_id}
    if(status){
        filter.status=status;
    }
     const goals = await Goal.find(filter)
        .populate("thrust_id", "name")        
        .populate("employee_id", "name email department")
        .sort({ createdAt: -1 })    
        if(goals.length===0){
            return res.status(200).json({
                message:"no Goals found",
                goals:[]
            })
        }
        return res.status(200).json({
            message:"Goals fetched successfully",
            totalGoals:goals.length,
            goals
        })
})
const editGoal=asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const goal=await Goal.find({_id:goal_id})
    if(goal.employee_id.toString()!==req.userid.toString()){
        throw new ApiError(400,"Not authorized")
    }
    if(goal.status!="draft"){
        throw new ApiError(400,"Cannot edit a submitted or locked goal")
    }
    const {title,description,target_value,target_date,weightage,thrust_id,uom_type}=req.body;
    if(weightage<10){
        throw new ApiError(400,"weightage cannot be lessthan 10");
    }
    const updatedGoal=await Goal.findByIdAndUpdate(
        goal_id,
        {
            $set:{
                title,description,target_date,target_value,weightage,thrust_id,uom_type
            }
        }
    )
    return res.status(200).json(
        new ApiResponse(200,goal,"updated the Goal")
    )
})
const getSingleGoal=asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const goal=await Goal.findById(goal_id)
    .populate("thrust_id","name")
    .populate("employee_id","name email department");
    return res.status(200).json(
        new ApiResponse(200,goal,"Fetched Goal successfully")
    )
})

export {
    editGoal,
    CreateGoal,
    getMyGoals,
    getSingleGoal,
    SubmitGoals
}
