import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getAchievementReportApi, exportCSVApi } from "../../api/reportApi"

const AchievementReport = () => {

    const [report, setReport] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [exporting, setExporting] = useState(false)
    const [filter, setFilter] = useState({
        quarter: "",
        year: new Date().getFullYear().toString()
    })

    const fetchReport = async () => {
        setLoading(true)
        try {
            const res = await getAchievementReportApi(filter.quarter, filter.year)
            console.log(res)
            setReport(res.data.data || [])
        } catch {
            setError("Failed to fetch report")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReport()
    }, [filter])

    const handleExport = async () => {
        setExporting(true)
        try {
            const res = await exportCSVApi(filter.quarter, filter.year)
            // create downloadable file from blob response
            const blob = new Blob([res.data], { type: "text/csv" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `achievement_report_${filter.quarter || "all"}_${filter.year || "all"}.csv`
            link.click()
            window.URL.revokeObjectURL(url)
        } catch {
            setError("Failed to export report")
        } finally {
            setExporting(false)
        }
    }

    const scoreColor = (score) => {
        if(score >= 80) return "text-green-600"
        if(score >= 50) return "text-yellow-600"
        return "text-red-600"
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Achievement Report</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Planned target vs actual achievement for all employees
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || report.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                        {exporting ? "Exporting..." : "Export CSV"}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6">
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

                {/* Report */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : report.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No data found</div>
                ) : (
                    report.map((empReport) => (
                        <div key={empReport.employee.email} className="mb-6">

                            {/* Employee Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                    {empReport.employee.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">
                                        {empReport.employee.name}
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        {empReport.employee.department}
                                    </p>
                                </div>
                            </div>

                            {/* Checkins Table */}
                            {empReport.checkins.length === 0 ? (
                                <p className="text-sm text-gray-400 ml-11">No check-ins yet</p>
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
                                            {empReport.checkins.map((c, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-800">
                                                        {c.goal_title}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {c.quarter} {c.year}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {c.target}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {c.actual}
                                                    </td>
                                                    <td className={`px-4 py-3 font-semibold ${scoreColor(c.score)}`}>
                                                        {c.score?.toFixed(1)}%
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 capitalize">
                                                        {c.status?.replace("_", " ")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Layout>
    )
}

export default AchievementReport