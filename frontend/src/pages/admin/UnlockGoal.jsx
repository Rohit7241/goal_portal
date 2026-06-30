import { useState } from "react"
import Layout from "../../../components/Layout.jsx"
import { unlockGoalApi } from "../../api/adminApi"
import { getSingleGoalApi } from "../../api/goalApi"

const UnlockGoal = () => {

    const [goalId, setGoalId] = useState("")
    const [goal, setGoal] = useState(null)
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSearch = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setGoal(null)
        if(!goalId.trim()){
            setError("Please enter a goal ID")
            return
        }
        try {
            const res = await getSingleGoalApi(goalId)
            setGoal(res.data.data)
        } catch {
            setError("Goal not found")
        }
    }

    const handleUnlock = async () => {
        if(!reason.trim()){
            setError("Please provide a reason for unlocking")
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")
        try {
            await unlockGoalApi(goal._id, reason)
            setSuccess("Goal unlocked successfully")
            setGoal({ ...goal, status: "approved" })
            setReason("")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to unlock goal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Unlock Goal</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Unlock a locked goal so the employee can edit it again
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={goalId}
                        onChange={(e) => setGoalId(e.target.value)}
                        placeholder="Paste Goal ID here"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                        Search
                    </button>
                </form>

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

                {/* Goal Details */}
                {goal && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                goal.status === "locked"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-green-100 text-green-700"
                            }`}>
                                {goal.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-gray-400 text-xs">Employee</p>
                                <p className="text-gray-700">{goal.employee_id?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Thrust Area</p>
                                <p className="text-gray-700">{goal.thrust_id?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Target</p>
                                <p className="text-gray-700">{goal.target_value || goal.target_date?.slice(0,10)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Weightage</p>
                                <p className="text-gray-700">{goal.weightage}%</p>
                            </div>
                        </div>

                        {goal.status === "locked" ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Unlocking
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    placeholder="e.g. Employee changed department, target needs revision..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                <button
                                    onClick={handleUnlock}
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                >
                                    {loading ? "Unlocking..." : "Unlock Goal"}
                                </button>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-2">
                                This goal is not locked, nothing to unlock.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default UnlockGoal