import mongoose,{mongo} from "mongoose"

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URI}/Goal_tracker`)
        console.log(`mongodb connected ${connectionInstance}`)
    }
    catch(error){
        console.error("Mongodb connection error",error)
        process.exit(1)
    }
}

export default connectDB