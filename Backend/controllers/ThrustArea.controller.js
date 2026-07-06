import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ThrustArea from "../models/ThrustArea.js"
import Goal from "../models/Goal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createThrustArea=asyncHandler(async(req,res)=>{
    const {name}=req.body
    const created_by=req.user._id
    if(!name){
        throw new ApiError(400,"Thrust area name is required")
    }
    const existing=await ThrustArea.findOne({
        name:{$regex:new RegExp(`^${name}$`,"i")}
    })
    if(existing){
        throw new ApiError(400,"Thrust area already exists")
    }
    const thrustArea=await ThrustArea.create({
        name,created_by
    })
    return res.status(201).json(
        new ApiResponse(201,thrustArea,"Thrust area created successfully")
    )
})

const getAllThrustAreas=asyncHandler(async(req,res)=>{
    const thrustAreas=await ThrustArea.find()
    .populate("created_by","name email")
    .sort({createdAt:-1})
    if(thrustAreas.length===0){
        return res.status(200).json(
            new ApiResponse(200,[],"No thrust areas found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,thrustAreas,"Thrust areas fetched successfully")
    )
})

const updateThrustArea = asyncHandler(async (req, res) => {

    const thrust_id = req.params.id
    const { name } = req.body

    if(!name){
        throw new ApiError(400, "Thrust area name is required")
    }

    const thrustArea = await ThrustArea.findById(thrust_id)
    if(!thrustArea){
        throw new ApiError(404, "Thrust area not found")
    }

     const duplicate = await ThrustArea.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: thrust_id }   
     })

    if(duplicate){
        throw new ApiError(400, "Thrust area with this name already exists")
    }
    const updated = await ThrustArea.findByIdAndUpdate(
        thrust_id,
        { $set: { name } },
        { new: true }
    )
    return res.status(200).json(
        new ApiResponse(200, updated, "Thrust area updated successfully")
    )
})

const deleteThrustArea = asyncHandler(async (req, res) => {
    const thrust_id = req.params.id
    const thrustArea = await ThrustArea.findById(thrust_id)
    if(!thrustArea){
        throw new ApiError(404, "Thrust area not found")
    }

    const goalsUsingIt = await Goal.countDocuments({ thrust_id })
    if(goalsUsingIt > 0){
        throw new ApiError(400, `Cannot delete — ${goalsUsingIt} goals are using this thrust area`)
    }
    await ThrustArea.findByIdAndDelete(thrust_id)
    return res.status(200).json(
        new ApiResponse(200, null, "Thrust area deleted successfully")
    )
})

export {
    createThrustArea,
    getAllThrustAreas,
    updateThrustArea,
    deleteThrustArea
}