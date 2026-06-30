import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getAuditLogApi } from "../../api/reportApi.js"

const AuditLog = () => {

    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await getAuditLogApi()
            setLogs(res.data.data || [])
        } catch {
            setError("Failed to fetch audit logs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track all changes made to goals after locking
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Logs */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No audit logs found</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Goal</th>
                                    <th className="px-4 py-3 text-left">Changed By</th>
                                    <th className="px-4 py-3 text-left">Field</th>
                                    <th className="px-4 py-3 text-left">Old Value</th>
                                    <th className="px-4 py-3 text-left">New Value</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {log.goal_id?.title || "Deleted Goal"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {log.changed_by?.name}
                                            <span className="text-xs text-gray-400 block">
                                                {log.changed_by?.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {log.field_changed}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {log.old_value}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 font-medium">
                                            {log.new_value}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(log.createdAt).toLocaleString()}
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

export default AuditLog