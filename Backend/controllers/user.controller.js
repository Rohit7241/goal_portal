import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
const generateAccessAndRefreshToken=async function(userid){
   try
   {
    let user=await User.findById(userid)
    if(!user){ 
        throw new ApiError(404,"User not found")
    }
    const Accesstoken=user.generateAccessToken()
    const Refreshtoken=user.generateRefreshToken()
    user.refreshToken=Refreshtoken
    await user.save({validateBeforeSave:false})
    return {Accesstoken,Refreshtoken}}
    catch(err){
        throw new ApiError(500,"Something went wrong in generating tokens",[err]);
    }
}
// The Tricky Part — manager_id
// When an employee registers, they need to select their manager. So your registration form should:
// Have a dropdown that fetches all users with role: "manager" from the DB
// Employee selects their manager from that dropdown
// That manager's _id gets saved as manager_id in the employee's document
const register=asyncHandler(async(req,res)=>{
    let {email,name,password,role,department,manager_id}=req.body;
    if(!email||!password||!name){
        throw new ApiError(401,"all fields are mandatory");
    }
    const userpresent=await User.findOne({email});
    if(userpresent){
        throw new ApiError(401,"User already present");
    }
    if(role!="Employee")manager_id=null;
    const saltrounds=12;
    const hash=await bcrypt.hash(password,saltrounds);
    const user=await User.create({name,email,role,manager_id,department,password:hash});
    if(!user){
        throw new ApiError(500,"internal server error");
    }
    return res.status(200).json(
        new ApiResponse(200,"OK","user account created")
    )
})
const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        throw new ApiError(401,"all fields are necessary");
    }
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const ismatch=await bcrypt.compare(password,user.password);
    if(!ismatch){
        throw new ApiError(401,"invalid credentials");
    }
     const {Accesstoken,Refreshtoken}=await generateAccessAndRefreshToken(user._id);
     const loggedinuser=await User.findById(user._id).select("-refreshToken")
        const options={
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"None",
        }
        return res.status(200)
        .cookie("AccessToken",Accesstoken,options)
        .cookie("RefreshToken",Refreshtoken,options)
        .json(
        new ApiResponse(200,{
            user:loggedinuser,Accesstoken,Refreshtoken
        },"user logged in successfully")
     )
})
export {register,login}