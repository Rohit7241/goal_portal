import { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const employeeLinks=[
    {label:"Dashboard",path:"/employee/dashboard"},
    {label:"Create Goal",path:"/employee/create-goal"},
    {label:"Check-in",path:"/employee/checkin"},
    {label:"My Check-ins",path:"/employee/my-checkins"}
]

const managerLinks=[
    {label:"Dashboard",path:"/manager/dashboard"},
    {label:"Team Goals",path:"/manager/team-goals"},
    {label:"Team Check-ins",path:"/manager/team-checkins"},
]

const adminLinks=[
    {label:"Dashboard",path:"/admin/dashboard"},
    {label:"Windows",path:"/admin/windows"},
    {label:"Thrust Areas",path:"/admin/thrust-areas"},
    {label:"Share Goal",path:"/admin/share-goal"},
    {label:"Unlock Goal",path:"/admin/unlock-goal"},
    {label:"Achievement Report",path:"/reports/achievement"},
    {label:"Completion Report",path:"/reports/completion"},
    {label:"Audit Log",path:"/reports/audit-log"}
]

const managerReportLinks=[
    {label:"Achievement Report",path:"/reports/achievement"},
    {label:"Completion Report",path:"/reports/completion"}
]

const Sidebar=()=>{

    const {user,logout}=useAuth()
    const navigate=useNavigate()
    const [collapsed,setcollapsed]=useState(false)

    const getLinks=()=>{
        if(user?.role==="employee")return employeeLinks
        if(user?.role==="manager")return [...managerLinks,...managerReportLinks]
        if(user?.role==="admin")return adminLinks
        return []
    }
    const handleLogout=()=>{
        logout()
        navigate("/login")
    }

    const roleBadgeColor={
        employee:"bg-green-100 text-green-700",
        manager:"bg-blue-100 text-blue-700",
        admin:"bg-purple-100 text-purple-700"
    }

    return(
        <div className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed?"w-16":"w-64"}`}>
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
                {!collapsed&&(
                    <span className="text-lg font-bolf tracking-wide">
                        Goal Portal
                    </span>
                )}
                <button onClick={()=>setcollapsed(!collapsed)} className="text-gray-400 hover:text-white ml-auto">
                    {collapsed?"->":"<-"}
                </button>
            </div>
            
            {!collapsed&&(
                <div className="px-4 py-4 border-b border-gray-700">
                    <p className="text-sm font-semibold text-white truncate">
                        {user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mb-2">
                        {user?.email}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleBadgeColor[user?.role]}`}>
                        {user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)}
                    </span>
                </div>
            )}

            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {getLinks().map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                            ${isActive
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        {!collapsed && link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-2 py-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all"
                >
                    {!collapsed && "Logout"}
                </button>
            </div>

        </div>
    )
}

export default Sidebar