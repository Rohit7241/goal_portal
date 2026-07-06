import jwt  from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import User from "../models/User.model.js";

const verifyjwt=asyncHandler(async(req,res,next)=>{
 try
 {const token=req.cookies.AccessToken
    if(!token){
    throw new ApiError(404,"unauthorized request")
    }
 const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 const user=await User.findById(decode._id)
 if(!user){
    throw new ApiError(404,"invalid access token")
 }
 req.user=user;
next()
}
catch(err){
    console.log("JWT ERROR:", err);
    throw new ApiError(401, err.message);
}
})
export {verifyjwt}