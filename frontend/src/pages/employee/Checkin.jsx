import { useState, useEffect } from "react"
import Layout from "../../components/Layout.jsx"
import { getMyGoalsApi } from "../../api/goalApi.js"
import { getActiveWindowApi, submitCheckinApi } from "../../api/checkinApi.js"
const Checkin = () => {
    const [activeWindow, setActiveWindow] = useState(null)
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [checkinData, setCheckinData] = useState({})

    useEffect(() => {
        const init = async () => {
            try {
                const windowRes = await getActiveWindowApi()
                setActiveWindow(windowRes.data.data)
                const goalsRes = await getMyGoalsApi("locked")
                const lockedGoals = goalsRes.data.data.goals || []
                setGoals(lockedGoals)
                const initial = {}
                lockedGoals.forEach(goal => {
                    initial[goal._id] = {
                        actual_value: "",
                        actual_date: "",
                        status: "not_started"
                    }
                })
                setCheckinData(initial)

            } catch {
                setError("Failed to load data")
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const handleCheckinChange = (goalId, field, value) => {
        setCheckinData(prev => ({
            ...prev,
            [goalId]: { ...prev[goalId], [field]: value }
        }))
    }

    const handleSubmitAll = async () => {
        setSubmitting(true)
        setError("")
        setSuccess("")

        try {
            for(const goal of goals){
                const data = checkinData[goal._id]
                await submitCheckinApi({
                    goal_id: goal._id,
                    actual_value: data.actual_value || null,
                    actual_date: data.actual_date || null,
                    status: data.status
                })
            }
            setSuccess("All check-ins submitted successfully!")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit check-ins")
        } finally {
            setSubmitting(false)
        }
    }

    if(loading){
        return <Layout><div className="text-center py-20 text-gray-400">Loading...</div></Layout>
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Quarterly Check-in</h1>
                    {activeWindow ? (
                        <p className="text-green-600 text-sm mt-1">
                            {activeWindow.quarter} {activeWindow.year} window is open
                            until {new Date(activeWindow.closes_on).toDateString()}
                        </p>
                    ) : (
                        <p className="text-red-500 text-sm mt-1">
                            No active check-in window right now
                        </p>
                    )}
                </div>
                {!activeWindow && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded-xl text-center">
                        Check-in window is currently closed. Please wait for Admin to open it.
                    </div>
                )}
                {activeWindow && goals.length === 0 && (
                    <div className="bg-gray-50 text-gray-500 px-4 py-6 rounded-xl text-center">
                        No approved goals found. Your goals must be approved by your manager first.
                    </div>
                )}

                {activeWindow && goals.length > 0 && (
                    <>
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

                        <div className="space-y-4">
                            {goals.map((goal) => (
                                <div key={goal._id} className="bg-white rounded-xl shadow-sm p-5">

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-800">
                                            {goal.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {goal.thrust_id?.name} • {goal.uom_type?.toUpperCase()} • Weightage: {goal.weightage}%
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Target: {goal.uom_type === "timeline"
                                                ? goal.target_date?.slice(0, 10)
                                                : goal.target_value
                                            }
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">

                                        {goal.uom_type !== "timeline" ? (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Actual Achievement
                                                </label>
                                                <input
                                                    type="number"
                                                    value={checkinData[goal._id]?.actual_value || ""}
                                                    onChange={(e) => handleCheckinChange(goal._id, "actual_value", e.target.value)}
                                                    placeholder="Enter actual"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Completion Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={checkinData[goal._id]?.actual_date || ""}
                                                    onChange={(e) => handleCheckinChange(goal._id, "actual_date", e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={checkinData[goal._id]?.status || "not_started"}
                                                onChange={(e) => handleCheckinChange(goal._id, "status", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="not_started">Not Started</option>
                                                <option value="on_track">On Track</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSubmitAll}
                                disabled={submitting}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit All Check-ins"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Checkin