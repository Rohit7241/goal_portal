import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getCompletionDashboardApi } from "../../api/reportApi"

const CompletionDashboard = () => {

    const [dashboard, setDashboard] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [year, setYear] = useState(new Date().getFullYear().toString())

    const fetchDashboard = async () => {
        setLoading(true)
        try {
            const res = await getCompletionDashboardApi(year)
            setDashboard(res.data.data || [])
        } catch {
            setError("Failed to fetch completion dashboard")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [year])

    const quarters = ["Q1", "Q2", "Q3", "Q4"]

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Completion Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track which employees have completed quarterly check-ins
                    </p>
                </div>

                {/* Year Filter */}
                <div className="mb-6">
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none w-32"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : dashboard.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No data found</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Employee</th>
                                    <th className="px-4 py-3 text-left">Department</th>
                                    {quarters.map(q => (
                                        <th key={q} className="px-4 py-3 text-center">{q}</th>
                                    ))}
                                    <th className="px-4 py-3 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dashboard.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {row.employee.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.employee.department}
                                        </td>
                                        {quarters.map((q) => (
                                            <td key={q} className="px-4 py-3 text-center">
                                                <span className={`inline-block w-3 h-3 rounded-full ${
                                                    row.quarters[q] === "completed"
                                                        ? "bg-green-500"
                                                        : "bg-red-300"
                                                }`}></span>
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center font-semibold text-gray-700">
                                            {row.totalCompleted}/4
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        Completed
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-300"></span>
                        Pending
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default CompletionDashboard