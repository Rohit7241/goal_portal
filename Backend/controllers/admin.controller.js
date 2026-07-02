import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CheckinWindow} from "../models/CheckinWindow.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Goal from "../models/Goal.js";
import bcrypt from "bcrypt.js"
const CreateWindow=asyncHandler(async(req,res)=>{
    const {quarter,year,opens_on,closes_on}=req.body;
    if(!quarter||!year||!opens_on||!closes_on){
        throw new ApiError(400,"All fields needed");
    }
    const existingWindow=await CheckinWindow.findOne({quater,year})
    if(existingWindow){
        throw new ApiError(400,`Window for ${quater} ${year} already exists`);
    }
    if(new Date(closes_on)<=new Date(opens_on)){
        throw new ApiError(400,"closing date must be after opening date")
    }
    const window=await CheckinWindow.create({
        quater,
        year,
        opens_on,
        closes_on,
        is_active:false
    })
    return res.status(201).json(
        new ApiResponse(201,window,"Check-in Window created")
    )
})

const activateWindow=asyncHandler(async(req,res)=>{
    const window_id=req.params.id;
    const activeWindow=await CheckinWindow.findOne({is_active:true});
    if(activateWindow){
        throw new ApiError(400,`${activateWindow.quarter} ${activateWindow.year} window is already Active`);
    }
    const window=await CheckinWindow.findByIdAndUpdate(
        window_id,
        {$set:{is_active:true}},
        {new:true}
    )
    if(!window){
        throw new ApiError(404,"Window not found")
    }
    return res.status(200).json(
        new ApiResponse(200,window,"window activated")
    )
})
const deactivateWindow=asyncHandler(async(req,res)=>{
    const window_id=req.params.id
    const window=await CheckinWindow.findById(window_id)
    if(!window){
        throw new ApiError(404,"Window not found")
    }
    if(!window.is_active){
        throw new ApiError(400,"Window is already inactive")
    }
    window.is_active=false
    await window.save()
    return res.status(200).json(
        new ApiResponse(200,window,"Window deactivated successfully")
    )
})
const getAllWindows=asyncHandler(async(req,res)=>{
    const windows=await CheckinWindow.find().sort({year:-1,quater:1})
    if(windows.length==0){
        return res.status(200).json(
            new ApiResponse(200,[],"No windows created yet")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,windows,"Fetched all windows")
    )
})
const unlockGoal=asyncHandler(async(req,res)=>{
    const goal_id=req.params.id
    const admin_id=req.user._id
    const {reason}=req.body
    if(!reason){
        throw new ApiError(400,"Please provide a reason for unlocking")
    }
    const goal=await Goal.findById(goal_id)
    if(!goal){
        throw new ApiError(404,"Goal not found")
    }
    if(goal.status!=="locked"){
        throw new ApiError(400,"Only locked goals can be unlocked")
    }
    const OldStatus=goal.status
    goal.status="approved"
    await goal.save()
    await AuditLog.create({
        goal_id,
        changed_by:admin_id,
        field_changed:"status",
        old_value:oldStatus,
        new_value="approved",
        reason
    })
    return res.status(200).json(
        new ApiResponse(200,goal,"Goal Unlocked")
    )
})

const shareGoal=asyncHandler(async(req,res)=>{
    const {goal_id,employee_ids,weightage}=req.body;

    if(!goal_id||!employee_ids||employee_ids.length===0){
        throw new ApiError(400,"Goal and employees are required")
    }
    if(weightage<10){
        throw new ApiError(400,"Weightage cannot be less than 10%")
    }

    const originalGoal=await Goal.findById(goal_id)
    if(!originalGoal){
        throw new ApiError(404,"Original goal not found")
    }

    const shareGoals=await Promise.all(
        employee_ids.map(async(employee_id)=>{
            const existingCount=await Goal.countDocuments({employee_id})
            if(existingCount>=8){
                return{
                    employee_id,
                    error:"Already has 8 goals skipped"
                }
            }
            return await Goal.create({
            employee_id,
            thrust_id:originalGoal.thrust_id,
            title:originalGoal.title,
            description:originalGoal.description,
            uom_type:originalGoal.uom_type,
            target_value:originalGoal.target_value,
            target_date:originalGoal.target_date,
            weightage,
            status:"submitted",
            is_shared:true,
            shared_by:req.user._id,
            parent_goal_id:originalGoal._id
             })
        })
    )
    return res.status(200).json(
        new ApiResponse(201,shareGoals,"Goal successfully shared")
    )
})

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, department, manager_id } = req.body;

    if (!name || !email || !password || !role || !department) {
        throw new ApiError(400, "All fields are required");
    }

    if (!["employee", "manager", "admin"].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    if (role === "employee" && !manager_id) {
        throw new ApiError(400, "Manager is required for employee accounts");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    if (manager_id) {
        const manager = await User.findById(manager_id);
        if (!manager || manager.role !== "manager") {
            throw new ApiError(400, "Invalid manager selected");
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        department,
        manager_id: role === "employee" ? manager_id : null
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json(
        new ApiResponse(201, userResponse, `${role} account created successfully`)
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const { role } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
        .select("-password")
        .populate("manager_id", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});

const getEmployees = asyncHandler(async (req, res) => {
    const employees = await User.find({ role: "employee" })
        .select("name email department manager_id");

    return res.status(200).json(
        new ApiResponse(200, employees, "Employees fetched successfully")
    );
});

const getManagers = asyncHandler(async (req, res) => {
    const managers = await User.find({ role: "manager" })
        .select("name email department");

    return res.status(200).json(
        new ApiResponse(200, managers, "Managers fetched successfully")
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    const { name, department, manager_id } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
        user_id,
        {
            $set: {
                ...(name && { name }),
                ...(department && { department }),
                ...(manager_id && { manager_id })
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const user_id = req.params.id;

    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const goalsCount = await Goal.countDocuments({ employee_id: user_id });
    if (goalsCount > 0) {
        throw new ApiError(400, `Cannot delete — this user has ${goalsCount} goals associated`);
    }

    await User.findByIdAndDelete(user_id);

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});


export {
    shareGoal,
    unlockGoal,
    CreateWindow,
    activateWindow,
    deactivateWindow,
    getAllWindows,
    createUser,
    getAllUsers,
    getEmployees,
    getManagers,
    updateUser,
    deleteUser
}

