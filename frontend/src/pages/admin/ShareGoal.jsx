import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import { shareGoalApi } from "../../api/adminApi"
import { getAllThrustAreasApi } from "../../api/thrustAreaApi"
import axiosInstance from "../../api/axiosInstance"

const ShareGoal = () => {

    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [thrustAreas, setThrustAreas] = useState([])

    const [formData, setFormData] = useState({
        thrust_id: "",
        title: "",
        description: "",
        uom_type: "min",
        target_value: "",
        target_date: "",
        weightage: ""
    })

    const [selectedEmployees, setSelectedEmployees] = useState([])

    // fetch employees and thrust areas for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                // NOTE: you'll need a simple GET /api/admin/employees route
                // returning all users with role employee. Add this quickly
                // in your admin or user controller if not already present.
                const empRes = await axiosInstance.get("/admin/employees")
                setEmployees(empRes.data.data || [])

                const thrustRes = await getAllThrustAreasApi()
                setThrustAreas(thrustRes.data.data || [])
            } catch {
                setError("Failed to load employees or thrust areas")
            }
        }
        fetchData()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const toggleEmployee = (id) => {
        setSelectedEmployees(prev =>
            prev.includes(id)
                ? prev.filter(empId => empId !== id)
                : [...prev, id]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if(selectedEmployees.length === 0){
            setError("Select at least one employee")
            return
        }
        if(!formData.title || !formData.weightage){
            setError("Title and weightage are required")
            return
        }

        setLoading(true)
        try {
            // first create the base goal as admin (re-use createGoal logic via share endpoint)
            // shareGoalApi expects an existing goal_id, so here we simplify:
            // we directly send full goal details + employee_ids in one call.
            // adjust shareGoalApi/controller to accept this shape if needed.
            await shareGoalApi({
                ...formData,
                employee_ids: selectedEmployees
            })
            setSuccess("Goal shared with selected employees successfully")
            setFormData({
                thrust_id: "", title: "", description: "",
                uom_type: "min", target_value: "", target_date: "", weightage: ""
            })
            setSelectedEmployees([])
        } catch (err) {
            setError(err.response?.data?.message || "Failed to share goal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Share Goal</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Push a departmental KPI to multiple employees at once
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

                    {/* Thrust Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thrust Area</label>
                        <select
                            name="thrust_id"
                            value={formData.thrust_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        >
                            <option value="">Select thrust area</option>
                            {thrustAreas.map((area) => (
                                <option key={area._id} value={area._id}>{area.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Zero Safety Incidents Q1"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        />
                    </div>

                    {/* UoM */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UoM Type</label>
                        <select
                            name="uom_type"
                            value={formData.uom_type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        >
                            <option value="min">Numeric — Higher is better</option>
                            <option value="max">Numeric — Lower is better</option>
                            <option value="timeline">Timeline</option>
                            <option value="zero">Zero based</option>
                        </select>
                    </div>

                    {/* Target */}
                    {formData.uom_type !== "timeline" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                            <input
                                type="number"
                                name="target_value"
                                value={formData.target_value}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                            <input
                                type="date"
                                name="target_date"
                                value={formData.target_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                            />
                        </div>
                    )}

                    {/* Default Weightage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Weightage (%) — employees can only adjust this
                        </label>
                        <input
                            type="number"
                            name="weightage"
                            value={formData.weightage}
                            onChange={handleChange}
                            min="10"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        />
                    </div>

                    {/* Employee Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Employees ({selectedEmployees.length} selected)
                        </label>
                        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {employees.map((emp) => (
                                <label
                                    key={emp._id}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployees.includes(emp._id)}
                                        onChange={() => toggleEmployee(emp._id)}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                                        <p className="text-xs text-gray-400">{emp.department}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? "Sharing..." : "Share Goal with Selected Employees"}
                    </button>

                </form>
            </div>
        </Layout>
    )
}

export default ShareGoal