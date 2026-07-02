import express, { urlencoded } from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

//routes
import userrouter from "./routes/user.routes.js"
import adminrouter from "./routes/admin.routes.js"
import Checkinrouter from "./routes/Checkin.routes.js"
import goalsrouter from "./routes/goals.routes.js"
import managerrouter from "./routes/manager.routes.js"
import reportrouter from "./routes/reports.routes.js"
import thrustarearouter from "./routes/thrustArea.routes.js"
app.use("/api/v1/auth",userrouter)
app.use("/api/v1/admin",adminrouter)
app.use("/api/v1/checkin",Checkinrouter)
app.use("/api/v1/goals",goalsrouter)
app.use("/api/v1/manager",managerrouter)
app.use("/api/v1/thrust-areas",thrustarearouter)
app.use("/api/v1/reports",reportrouter)
export {app} 