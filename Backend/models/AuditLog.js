import { Model,Schema } from "mongoose";

const AuditlogSchema=new Schema({
    goal_id:{
        type:Schema.Types.ObjectId,
        ref:"Goal"
    },
    changed_by:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    field_changed:{
        type:String
    },
    old_value:{
        type:String,
    },
    new_value:{
        type:String
    }
}
,{timestamps:true})

const Auditlog=mongoose.model("Auditlog",AuditlogSchema);

export default Auditlog;
