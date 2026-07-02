import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Login from "./pages/auth/Login.jsx"

import EmployeeDashboard from "./pages/employee/DashBoard.jsx"
import CreateGoal from "./pages/employee/CreateGoal"
import Checkin from "./pages/employee/Checkin"
import MyCheckins from "./pages/employee/MyCheckins"

// Manager
import ManagerDashboard from "./pages/manager/Dashboard"
import TeamGoals from "./pages/manager/TeamGoals"
import TeamCheckins from "./pages/manager/TeamCheckins"

// Admin
import AdminDashboard from "./pages/admin/Dashboard"
import Windows from "./pages/admin/Windows"
import ThrustAreas from "./pages/admin/ThrustArea"
import ShareGoal from "./pages/admin/ShareGoal"
import UnlockGoal from "./pages/admin/UnlockGoal"
import Register from "./pages/auth/Register.jsx";
// Reports
import AchievementReport from "./pages/reports/AchievementReport"
import CompletionDashboard from "./pages/reports/CompletionDashboard"
import AuditLog from "./pages/reports/AuditLog"

function App(){
  return(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Navigate to="/login"/>}/>
                {/* EMPLOYEE */}
            <Route path="/employee/dashboard" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="register" element={<Register/>}/>
            <Route path="/employee/create-goal" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <CreateGoal/>
              </ProtectedRoute>
            }/>
            <Route path="/employee/my-checkins" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <MyCheckins/>
              </ProtectedRoute>
            }/>
                   {/* MANAGER  */}
            <Route path="/manager/dashboard" element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="/manager/team-goals" element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <CreateGoal/>
              </ProtectedRoute>
            }/>
            <Route path="/manager/team-checkins" element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <TeamCheckins/>
              </ProtectedRoute>
            }/>
            {/* ADMIN */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="/admin/windows" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Windows/>
              </ProtectedRoute>
            }/>
            <Route path="/admin/thrust-areas" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ThrustAreas/>
              </ProtectedRoute>
            }/>
            <Route path="/admin/share-goal" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ShareGoal/>
              </ProtectedRoute>
            }/>
            <Route path="/admin/unlock-goal" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UnlockGoal/>
              </ProtectedRoute>
            }/>
            {/* REPORT */}
            <Route path="/reports/achievement" element={
              <ProtectedRoute allowedRoles={["admin","manager"]}>
                <AchievementReport/>
              </ProtectedRoute>
            }/>
            <Route path="/reports/completion" element={
              <ProtectedRoute allowedRoles={["admin","manager"]}>
                <CompletionDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="/reports/audit-log" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AuditLog/>
              </ProtectedRoute>
            }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App