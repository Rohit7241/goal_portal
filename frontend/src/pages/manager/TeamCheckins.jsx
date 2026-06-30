import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getTeamCheckinsApi, addCommentApi } from "../../api/managerApi.js"

const TeamCheckins = () => {

    const [checkins, setCheckins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [comments, setComments] = useState({})
    const [submittingComment, setSubmittingComment] = useState(null)
    const [filter, setFilter] = useState({
        quarter: "Q1",
        year: new Date().getFullYear().toString()
    })

    const fetchCheckins = async () => {
        setLoading(true)
        try {
            const res = await getTeamCheckinsApi(filter.quarter, filter.year)
            setCheckins(res.data.data || [])
        } catch {
            setError("Failed to fetch check-ins")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCheckins()
    }, [filter])

    const handleCommentChange = (checkinId, value) => {
        setComments(prev => ({ ...prev, [checkinId]: value }))
    }

    const handleAddComment = async (checkinId) => {
        if(!comments[checkinId]?.trim()){
            setError("Comment cannot be empty")
            return
        }
        setSubmittingComment(checkinId)
        setError("")
        setSuccess("")
        try {
            await addCommentApi(checkinId, comments[checkinId])
            setSuccess("Comment added successfully")
            setComments(prev => ({ ...prev, [checkinId]: "" }))
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add comment")
        } finally {
            setSubmittingComment(null)
        }
    }

    const scoreColor = (score) => {
        if(score >= 80) return "text-green-600"
        if(score >= 50) return "text-yellow-600"
        return "text-red-600"
    }

    // group by employee
    const checkinsByEmployee = checkins.reduce((acc, checkin) => {
        const empId = checkin.employee_id?._id
        const empName = checkin.employee_id?.name || "Unknown"
        const empDept = checkin.employee_id?.department || ""
        if(!acc[empId]){
            acc[empId] = { name: empName, department: empDept, checkins: [] }
        }
        acc[empId].checkins.push(checkin)
        return acc
    }, {})

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Team Check-ins
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review quarterly achievements and add feedback
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    <select
                        value={filter.quarter}
                        onChange={(e) => setFilter({ ...filter, quarter: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                    </select>
                    <input
                        type="number"
                        value={filter.year}
                        onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none w-28"
                    />
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

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : checkins.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No check-ins found for {filter.quarter} {filter.year}
                    </div>
                ) : (
                    Object.values(checkinsByEmployee).map((emp) => (
                        <div key={emp.name} className="mb-8">

                            {/* Employee Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">{emp.name}</h2>
                                    <p className="text-xs text-gray-400">{emp.department}</p>
                                </div>
                            </div>

                            {/* Checkins Table */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-3">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Goal</th>
                                            <th className="px-4 py-3 text-left">Target</th>
                                            <th className="px-4 py-3 text-left">Actual</th>
                                            <th className="px-4 py-3 text-left">Score</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {emp.checkins.map((checkin) => (
                                            <tr key={checkin._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {checkin.goal_id?.title}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {checkin.goal_id?.target_value || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {checkin.actual_value || checkin.actual_date?.slice(0,10) || "—"}
                                                </td>
                                                <td className={`px-4 py-3 font-semibold ${scoreColor(checkin.score)}`}>
                                                    {checkin.score?.toFixed(1)}%
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 capitalize">
                                                    {checkin.status?.replace("_", " ")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Comment Box per Employee */}
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manager Feedback for {emp.name}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Add your check-in comment and feedback..."
                                    value={comments[emp.checkins[0]?._id] || ""}
                                    onChange={(e) => handleCommentChange(emp.checkins[0]?._id, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleAddComment(emp.checkins[0]?._id)}
                                        disabled={submittingComment === emp.checkins[0]?._id}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                    >
                                        {submittingComment === emp.checkins[0]?._id
                                            ? "Saving..."
                                            : "Save Comment"
                                        }
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </Layout>
    )
}

export default TeamCheckins