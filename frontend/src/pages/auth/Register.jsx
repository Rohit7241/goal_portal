import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"

const Register = () => {

    const navigate = useNavigate()

    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Employee",
        department: "",
        manager_id: ""
    })

    // fetch managers when role is Employee
    useEffect(() => {
        if(formData.role === "Employee"){
            const fetchManagers = async () => {
                try {
                    const res = await axiosInstance.get("/admin/managers")
                    setManagers(res.data.data || [])
                } catch {
                    setManagers([])
                }
            }
            fetchManagers()
        } else {
            // clear manager selection if role changes away from Employee
            setManagers([])
            setFormData(prev => ({ ...prev, manager_id: "" }))
        }
    }, [formData.role])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        // frontend validation
        if(!formData.name || !formData.email || !formData.password){
            setError("Name, email and password are required")
            return
        }
        if(!formData.department){
            setError("Department is required")
            return
        }
        if(formData.role === "Employee" && !formData.manager_id){
            setError("Please select your manager")
            return
        }
        if(formData.password.length < 6){
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
           let response=await axiosInstance.post("/auth/register", formData)
           console.log(response);
            setSuccess("Account created successfully! Redirecting to login...")
            setTimeout(() => navigate("/login"), 1500)
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Registration failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Goal Portal</h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Sales, HR, Engineering"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {formData.role === "Employee" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Manager
                            </label>
                            <select
                                name="manager_id"
                                value={formData.manager_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select your manager</option>
                                {managers.length === 0 ? (
                                    <option disabled>No managers found</option>
                                ) : (
                                    managers.map((mgr) => (
                                        <option key={mgr._id} value={mgr._id}>
                                            {mgr.name} — {mgr.department}
                                        </option>
                                    ))
                                )}
                            </select>
                            {managers.length === 0 && formData.role === "Employee" && (
                                <p className="text-xs text-yellow-600 mt-1">
                                    No managers exist yet. Ask your admin to create a manager account first.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </a>
                </p>

            </div>
        </div>
    )
}

export default Register