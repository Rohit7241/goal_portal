import mongoose, { Model,Mongoose,Schema } from "mongoose";

const CheckinWindowSchema=new Schema({
    quarter:{
        type:String,
        enum:["Q1","Q2","Q3"]
    },
    year:{
        type:Number,
    },
    opens_on:{
        type:Date,
    },
    closes_on:{
        type:Date,
    },
    is_active:{
        type:Boolean,
        default:false
    }
}
,{timestamps:true})

const CheckinWindow=mongoose.model("CheckinWindow",CheckinWindowSchema);

export default CheckinWindow
