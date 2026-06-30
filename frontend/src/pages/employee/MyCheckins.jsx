import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getMyCheckinsApi } from "../../api/checkinApi.js"

const MyCheckins = () => {

    const [checkins, setCheckins] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({ quarter: "", year: "" })

    const fetchCheckins = async () => {
        setLoading(true)
        try {
            const res = await getMyCheckinsApi(filter.quarter, filter.year)
            setCheckins(res.data.data || [])
        } catch {
            setCheckins([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCheckins()
    }, [filter])

    const scoreColor = (score) => {
        if(score >= 80) return "text-green-600"
        if(score >= 50) return "text-yellow-600"
        return "text-red-600"
    }

    const statusColor = {
        not_started: "bg-gray-100 text-gray-600",
        on_track: "bg-blue-100 text-blue-600",
        completed: "bg-green-100 text-green-600"
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Check-ins</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View your quarterly achievement history
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-4">
                    <select
                        value={filter.quarter}
                        onChange={(e) => setFilter({ ...filter, quarter: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    >
                        <option value="">All Quarters</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Year e.g. 2025"
                        value={filter.year}
                        onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none w-36"
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : checkins.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No check-ins found</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Goal</th>
                                    <th className="px-4 py-3 text-left">Quarter</th>
                                    <th className="px-4 py-3 text-left">Target</th>
                                    <th className="px-4 py-3 text-left">Actual</th>
                                    <th className="px-4 py-3 text-left">Score</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {checkins.map((checkin) => (
                                    <tr key={checkin._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {checkin.goal_id?.title}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {checkin.quarter} {checkin.year}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {checkin.goal_id?.target_value || checkin.goal_id?.target_date?.slice(0,10)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {checkin.actual_value || checkin.actual_date?.slice(0,10) || "—"}
                                        </td>
                                        <td className={`px-4 py-3 font-semibold ${scoreColor(checkin.score)}`}>
                                            {checkin.score?.toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[checkin.status]}`}>
                                                {checkin.status?.replace("_", " ")}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default MyCheckins