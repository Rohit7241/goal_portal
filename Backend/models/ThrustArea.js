import { Model,Schema } from "mongoose";

const ThrustSchema=new Schema({
   name:{
    type:String,
    created_by:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   }
}
,{timestamps:true})

const ThrustArea=mongoose.model("ThrustArea",ThrustSchema);

export default ThrustArea;
