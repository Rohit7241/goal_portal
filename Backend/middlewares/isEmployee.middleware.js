import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyEmployee=asyncHandler(async(req,res,next)=>{
    if(req.role==="Employee"){
        return next();
    }
    else{
        throw new ApiError(403,"forbidden entry");
    }
})