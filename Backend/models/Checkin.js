import { Model,Schema } from "mongoose";

const CheckinSchema=new Schema({
    goal_id:{
        type:Schema.Types.ObjectId,
        ref:"Goal"
    },
    employee_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    quater:{
        type:String
    },
    year:{
        type:Number,
    },
    actual_value:{
        type:Number,
        default:null
    },
    actual_date:{
        type:Date,
        default:null,
    },
    status:{
        type:String,
        default:["not_started","on_track","completed"]
    },
    score:{
        type:Number
    }
}
,{timestamps:true})

const Checkin=mongoose.model("Checkin",CheckinSchema);

export default Checkin;
