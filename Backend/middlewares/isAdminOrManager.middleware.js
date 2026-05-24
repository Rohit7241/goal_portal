import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyManager=asyncHandler(async(req,res,next)=>{
    if(req.user.role==="Manager"||req.user.role=="Admin"){
        return next();
    }
    else{
        throw new ApiError(403,"forbidden entry");
    }
})

