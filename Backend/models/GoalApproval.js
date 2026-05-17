import { Model,Schema } from "mongoose";

const GoalAppSchema=new Schema({
    goal_id:{
        type:Schema.Types.ObjectId,
        ref:"Goal",
        required:true
    },
    manager_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    action:{
        type:String,
        enum:["approved","returned"]
    },
    comment:{
        type:String,
        default:null
    }
}
,{timestamps:true})

const GoalApp=mongoose.model("GoalApp",GoalAppSchema);

export default GoalApp;
