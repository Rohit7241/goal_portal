import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute=({children,allowedRoles})=>{
    const {user,loading}=useAuth()
    if(loading){
        return <div className="flex justify-center items-center h-screen">
            LOADING...
        </div>
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(allowedRoles&&allowedRoles.includes(user.role)){
        return <Navigate to={`/${user.role}/dashboard`} replace/>
    }
    return children
}

export default ProtectedRoute