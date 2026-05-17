import { Model,Schema } from "mongoose";

const GoalSchema=new Schema({
    employee_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    thrust_id:{
        type:Schema.Types.ObjectId,
        ref:"ThrustArea",
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    uom_type:{
        type:String,
        enum:["min","max","timeline","zero"]
    },
    target_value:{
        type:Number,
        default:null,
    },
    target_date:{
        type:Date,
        default:null
    },
    weightage:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["draft","submitted","approved","locked"]
    },
    is_shared:{
        type:Boolean,
        default:false
    },
    shared_by:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    parent_goal_id:{
        type:Schema.Types.ObjectId,
        ref:"Goal",
        default:null
    }
}
,{timestamps:true})

const Goal=mongoose.model("Goal",GoalSchema);

export default Goal;
