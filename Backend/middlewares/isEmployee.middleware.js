import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const verifyEmployee=asyncHandler(async(req,res,next)=>{
    if(req.user.role==="Employee"){
        return next();
    }
    else{
        throw new ApiError(403,"forbidden entry");
    }
})