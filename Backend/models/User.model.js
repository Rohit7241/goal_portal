import mongoose,{Schema } from "mongoose";
import jwt from "jsonwebtoken";
const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Employee","Manager","Admin"]
    },
    manager_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },
    department:{
        type:String
    }
}
,{timestamps:true})

UserSchema.methods.generateAccessToken=function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    name:this.name
  },process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
UserSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
  },process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}


 const User=mongoose.model("User",UserSchema);
export default User;

