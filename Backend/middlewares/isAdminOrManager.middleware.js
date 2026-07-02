import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyManagerOrAdmin=asyncHandler(async(req,res,next)=>{
    if(req.user.role==="Manager"||req.user.role=="Admin"){
        return next();
    }
    else{
        throw new ApiError(403,"forbidden entry");
    }
})

