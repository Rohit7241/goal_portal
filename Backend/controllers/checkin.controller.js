import CheckinWindow from "../models/CheckinWindow.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";

const getActiveWindow=asyncHandler(async(req,res)=>{
    const today=new Date()
    const activeWindow=await CheckinWindow.findOne({
        is_active:true,
        opens_on:{$lte:today},//opens_on<=today
        closes_on:{$gte:today}//closes_on>=today
    })
    if(!activeWindow){
    return res.status(200).json(
        new ApiResponse(200,null,"No active check-in window right now")
    )
}
return res.status(200).json(
    new ApiResponse(200,activeWindow,"active window found")
)
})

const submitCheckin = asyncHandler(async (req, res) => {

    const employee_id = req.user._id
    const { goal_id, actual_value, actual_date, status } = req.body

    // Step 1 — check active window exists
    const today = new Date()
    const activeWindow = await CheckinWindow.findOne({
        is_active: true,
        opens_on: { $lte: today },
        closes_on: { $gte: today }
    })

    if(!activeWindow){
        throw new ApiError(400, "No active check-in window right now")
    }

    // Step 2 — find the goal
    const goal = await Goal.findById(goal_id)
    if(!goal){
        throw new ApiError(404, "Goal not found")
    }

    // Step 3 — check this goal belongs to this employee
    if(goal.employee_id.toString() !== employee_id.toString()){
        throw new ApiError(403, "Not authorized")
    }

    // Step 4 — check goal is locked (only locked goals can have checkins)
    if(goal.status !== "locked"){
        throw new ApiError(400, "Goal must be approved and locked before check-in")
    }

    // Step 5 — check checkin doesnt already exist for this quarter+year+goal
    const existingCheckin = await Checkin.findOne({
        goal_id,
        employee_id,
        quarter: activeWindow.quarter,
        year: activeWindow.year
    })

    if(existingCheckin){
        throw new ApiError(400, `You have already submitted check-in for ${activeWindow.quarter} ${activeWindow.year}`)
    }

    // Step 6 — calculate score
    const score = calculateScore(
        goal.uom_type,
        goal.target_value,
        actual_value,
        goal.target_date,
        actual_date
    )

    // Step 7 — save checkin
    const checkin = await Checkin.create({
        goal_id,
        employee_id,
        quarter: activeWindow.quarter,
        year: activeWindow.year,
        actual_value: actual_value || null,
        actual_date: actual_date || null,
        status,
        score
    })

    return res.status(201).json(
        new ApiResponse(201, checkin, "Check-in submitted successfully")
    )
})
const getMyCheckins = asyncHandler(async (req, res) => {

    const employee_id = req.user._id
    const { quarter, year } = req.query

    // build filter
    const filter = { employee_id }
    if(quarter) filter.quarter = quarter
    if(year) filter.year = year

    const checkins = await Checkin.find(filter)
        .populate("goal_id", "title uom_type target_value target_date weightage")
        .sort({ createdAt: -1 })

    if(checkins.length === 0){
        return res.status(200).json(
            new ApiResponse(200, [], "No check-ins found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, checkins, "Check-ins fetched successfully")
    )
})
const getTeamCheckins = asyncHandler(async (req, res) => {

    const manager_id = req.user._id
    const { quarter, year } = req.query

    // Step 1 — get all employees under this manager
    const employees = await User.find({ manager_id })

    if(employees.length === 0){
        return res.status(200).json(
            new ApiResponse(200, [], "No employees under you")
        )
    }

    const employeeIds = employees.map(emp => emp._id)

    // Step 2 — build filter
    const filter = { employee_id: { $in: employeeIds } }
    if(quarter) filter.quarter = quarter
    if(year) filter.year = year

    // Step 3 — fetch checkins
    const checkins = await Checkin.find(filter)
        .populate("employee_id", "name email department")
        .populate("goal_id", "title uom_type target_value weightage")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, checkins, "Team check-ins fetched successfully")
    )
})
const addComment = asyncHandler(async (req, res) => {

    const checkin_id = req.params.id
    const manager_id = req.user._id
    const { comment_text } = req.body

    // Step 1 — comment cannot be empty
    if(!comment_text){
        throw new ApiError(400, "Comment cannot be empty")
    }

    // Step 2 — find the checkin
    const checkin = await Checkin.findById(checkin_id)
        .populate("employee_id")

    if(!checkin){
        throw new ApiError(404, "Check-in not found")
    }

    // Step 3 — check this employee reports to this manager
    if(checkin.employee_id.manager_id.toString() !== manager_id.toString()){
        throw new ApiError(403, "Not authorized to comment on this check-in")
    }

    // Step 4 — check if comment already exists for this checkin
    const existingComment = await CheckinComment.findOne({ 
        checkin_id, 
        manager_id 
    })

    if(existingComment){
        // update existing comment instead of creating new one
        existingComment.comment_text = comment_text
        await existingComment.save()

        return res.status(200).json(
            new ApiResponse(200, existingComment, "Comment updated successfully")
        )
    }

    // Step 5 — create new comment
    const comment = await CheckinComment.create({
        checkin_id,
        manager_id,
        comment_text
    })

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})

export {
    getActiveWindow,submitCheckin,getMyCheckins,getTeamCheckins,addComment
}
