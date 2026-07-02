import mongoose, { Model,Mongoose,Schema } from "mongoose";

const CheckinCommentSchema=new Schema({
    checkin_id:{
        type:Schema.Types.ObjectId,
        ref:"Checkin"
    },
    manager_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    comment:{
        type:String
    }
}
,{timestamps:true})

const CheckinComment=mongoose.model("CheckinComment",CheckinCommentSchema);

export default CheckinComment;
