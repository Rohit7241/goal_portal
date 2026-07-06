import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getMyGoalsApi } from "../../api/goalApi.js"

const Dashboard = () => {

    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("all")

    const fetchGoals = async () => {
        setLoading(true)
        try {
            const status = filter === "all" ? "" : filter
            const res = await getMyGoalsApi(status)
            console.log(res.data.goals);
            setGoals(res.data.goals || [])
        } catch (err) {
            console.log(err)
            setError("Failed to fetch goals")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [filter])

    // total weightage calculator
    const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0)

    // status badge color
    const statusColor = {
        draft: "bg-yellow-100 text-yellow-700",
        submitted: "bg-blue-100 text-blue-700",
        approved: "bg-green-100 text-green-700",
        locked: "bg-gray-100 text-gray-700"
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            My Goals
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage and track your goals
                        </p>
                    </div>
                    <a
                        href="/employee/create-goal"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        + Add Goal
                    </a>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Total Goals", value: goals.length },
                        { label: "Total Weightage", value: `${totalWeightage}%` },
                        { label: "Draft", value: goals.filter(g => g.status === "draft").length },
                        { label: "Locked", value: goals.filter(g => g.status === "locked").length }
                    ].map((card) => (
                        <div key={card.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>
                {goals.length > 0 && totalWeightage !== 100 && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-4">
                        Total weightage is {totalWeightage}%. It must equal 100% before submitting.
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    {["all", "draft", "submitted", "locked"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                                ${filter === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">
                        Loading goals...
                    </div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No goals found. Click Add Goal to create one.
                    </div>
                ) : (
                    <>
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
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {goals.map((goal) => (
                                        <tr key={goal._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">
                                                    {goal.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {goal.description}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {goal.thrust_id?.name || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 uppercase">
                                                {goal.uom_type}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {goal.uom_type === "timeline"
                                                    ? goal.target_date?.slice(0, 10)
                                                    : goal.target_value
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {goal.weightage}%
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[goal.status]}`}>
                                                    {goal.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {goal.status === "draft" && (
                                                    
                                                      <a  href={`/employee/create-goal?edit=${goal._id}`}
                                                        className="text-blue-600 hover:underline text-xs"
                                                    >
                                                        Edit
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Submit All Button */}
                        {goals.some(g => g.status === "draft") && (
                            <div className="mt-4 flex justify-end">
                                <SubmitGoalsButton onSuccess={fetchGoals} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}

// separate small component for submit button
const SubmitGoalsButton = ({ onSuccess }) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        setLoading(true)
        setError("")
        try {
            const { submitGoalsApi } = await import("../../api/goalApi")
            await submitGoalsApi()
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit goals")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {error && (
                <p className="text-red-500 text-xs mb-2 text-right">{error}</p>
            )}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit All Goals for Approval"}
            </button>
        </div>
    )
}

export default Dashboard