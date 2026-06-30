import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import {
    getTeamGoalsApi,
    approveGoalApi,
    returnGoalApi,
    editGoalBeforeApprovalApi
} from "../../api/managerApi.js"

const TeamGoals = () => {

    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [returnModal, setReturnModal] = useState({ open: false, goalId: null })
    const [returnComment, setReturnComment] = useState("")

    const [editingGoal, setEditingGoal] = useState(null)
    const [editValues, setEditValues] = useState({ target_value: "", weightage: "" })

    const fetchGoals = async () => {
        setLoading(true)
        try {
            const res = await getTeamGoalsApi()
            setGoals(res.data.data || [])
        } catch {
            setError("Failed to fetch team goals")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleApprove = async (goalId) => {
        setError("")
        setSuccess("")
        try {
            await approveGoalApi(goalId)
            setSuccess("Goal approved and locked successfully")
            fetchGoals()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve goal")
        }
    }

    const openReturnModal = (goalId) => {
        setReturnModal({ open: true, goalId })
        setReturnComment("")
    }

    // confirm return
    const handleReturn = async () => {
        if(!returnComment.trim()){
            setError("Please provide a reason for returning")
            return
        }
        try {
            await returnGoalApi(returnModal.goalId, returnComment)
            setSuccess("Goal returned for rework")
            setReturnModal({ open: false, goalId: null })
            fetchGoals()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to return goal")
        }
    }

    const startEdit = (goal) => {
        setEditingGoal(goal._id)
        setEditValues({
            target_value: goal.target_value || "",
            weightage: goal.weightage || ""
        })
    }

    const saveEdit = async (goalId) => {
        try {
            await editGoalBeforeApprovalApi(goalId, editValues)
            setSuccess("Goal updated successfully")
            setEditingGoal(null)
            fetchGoals()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update goal")
        }
    }

    const goalsByEmployee = goals.reduce((acc, goal) => {
        const empId = goal.employee_id?._id
        const empName = goal.employee_id?.name || "Unknown"
        if(!acc[empId]){
            acc[empId] = { name: empName, goals: [] }
        }
        acc[empId].goals.push(goal)
        return acc
    }, {})

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Team Goals</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review and approve goals submitted by your team
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

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No submitted goals from your team yet
                    </div>
                ) : (
                    // grouped by employee
                    Object.values(goalsByEmployee).map((emp) => (
                        <div key={emp.name} className="mb-6">

                            {/* Employee Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                    {emp.name.charAt(0)}
                                </div>
                                <h2 className="font-semibold text-gray-800">{emp.name}</h2>
                                <span className="text-xs text-gray-400">
                                    {emp.goals.length} goals
                                </span>
                            </div>

                            {/* Goals Table */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Goal</th>
                                            <th className="px-4 py-3 text-left">Thrust Area</th>
                                            <th className="px-4 py-3 text-left">UoM</th>
                                            <th className="px-4 py-3 text-left">Target</th>
                                            <th className="px-4 py-3 text-left">Weightage</th>
                                            <th className="px-4 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {emp.goals.map((goal) => (
                                            <tr key={goal._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-800">
                                                        {goal.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {goal.description}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {goal.thrust_id?.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 uppercase">
                                                    {goal.uom_type}
                                                </td>

                                                {/* Inline editable target */}
                                                <td className="px-4 py-3">
                                                    {editingGoal === goal._id ? (
                                                        <input
                                                            type="number"
                                                            value={editValues.target_value}
                                                            onChange={(e) => setEditValues({
                                                                ...editValues,
                                                                target_value: e.target.value
                                                            })}
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600">
                                                            {goal.target_value || goal.target_date?.slice(0,10)}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {editingGoal === goal._id ? (
                                                        <input
                                                            type="number"
                                                            value={editValues.weightage}
                                                            onChange={(e) => setEditValues({
                                                                ...editValues,
                                                                weightage: e.target.value
                                                            })}
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600">
                                                            {goal.weightage}%
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        {editingGoal === goal._id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => saveEdit(goal._id)}
                                                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingGoal(null)}
                                                                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(goal._id)}
                                                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => startEdit(goal)}
                                                                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => openReturnModal(goal._id)}
                                                                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                                                >
                                                                    Return
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}

                {returnModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Return Goal for Rework
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                Please provide a reason so the employee knows what to fix:
                            </p>
                            <textarea
                                value={returnComment}
                                onChange={(e) => setReturnComment(e.target.value)}
                                rows={4}
                                placeholder="e.g. Target value seems too low, please revise..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setReturnModal({ open: false, goalId: null })}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReturn}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
                                >
                                    Return Goal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default TeamGoals