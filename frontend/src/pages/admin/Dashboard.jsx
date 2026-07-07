import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getAllWindowsApi } from "../../api/adminApi"
import { getCompletionDashboardApi } from "../../api/reportApi"

const AdminDashboard = () => {
    const [activeWindow, setActiveWindow] = useState(null)
    const [completionStats, setCompletionStats] = useState({ total: 0, completed: 0 })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const windowsRes = await getAllWindowsApi()
                const windows = windowsRes.data.data || []
                const active = windows.find(w => w.is_active)
                setActiveWindow(active || null)
                const completionRes = await getCompletionDashboardApi(new Date().getFullYear())
                console.log(completionRes)
                const dashboard = completionRes.data.data || []
                const totalCompleted = dashboard.reduce((sum, d) => sum + d.totalCompleted, 0)
                setCompletionStats({
                    total: dashboard.length,
                    completed: totalCompleted
                })
            } catch {
                // fail silently
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const quickLinks = [
        { label: "Check-in Windows", desc: "Open/close quarterly windows", path: "/admin/windows" },
        { label: "Thrust Areas", desc: "Manage company priorities", path: "/admin/thrust-areas" },
        { label: "Share Goal", desc: "Push to multiple employees", path: "/admin/share-goal" },
        { label: "Unlock Goal", desc: "Unlock a locked goal", path: "/admin/unlock-goal" },
        { label: "Achievement Report", desc: "Planned vs actual report", path: "/reports/achievement" },
        { label: "Audit Log", desc: "View all goal changes", path: "/reports/audit-log" }
    ]

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        System overview and controls
                    </p>
                </div>

                {/* Status Cards */}
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading...</div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className={`rounded-xl p-5 ${activeWindow ? "bg-green-50" : "bg-red-50"}`}>
                            <p className={`text-sm font-medium ${activeWindow ? "text-green-700" : "text-red-700"}`}>
                                {activeWindow
                                    ? `${activeWindow.quarter} ${activeWindow.year} Window Active`
                                    : "No Active Window"
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {activeWindow
                                    ? `Closes ${new Date(activeWindow.closes_on).toDateString()}`
                                    : "Open a window to start check-ins"
                                }
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-5">
                            <p className="text-2xl font-bold text-blue-700">
                                {completionStats.total}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">Total Employees</p>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-5">
                            <p className="text-2xl font-bold text-purple-700">
                                {completionStats.completed}
                            </p>
                            <p className="text-sm text-purple-600 mt-1">Total Check-ins Done</p>
                        </div>
                    </div>
                )}

                {/* Quick Links Grid */}
                <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
                        >
                            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                                {link.label}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {link.desc}
                            </p>
                        </a>
                    ))}
                </div>

            </div>
        </Layout>
    )
}

export default AdminDashboard