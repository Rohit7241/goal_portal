import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import { getTeamGoalsApi } from "../../api/managerApi"
import { getTeamCheckinsApi } from "../../api/managerApi"

const ManagerDashboard = () => {

    const [stats, setStats] = useState({
        totalTeamGoals: 0,
        pendingApprovals: 0,
        approvedGoals: 0,
        totalCheckins: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const goalsRes = await getTeamGoalsApi()
                console.log(goalsRes)
                const goals = goalsRes.data.data || []

                const checkinsRes = await getTeamCheckinsApi("", "")
                const checkins = checkinsRes.data.data || []

                setStats({
                    totalTeamGoals: goals.length,
                    pendingApprovals: goals.filter(g => g.status === "submitted").length,
                    approvedGoals: goals.filter(g => g.status === "locked").length,
                    totalCheckins: checkins.length
                })
            } catch {
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: "Total Team Goals", value: stats.totalTeamGoals, color: "bg-blue-50 text-blue-700" },
        { label: "Pending Approvals", value: stats.pendingApprovals, color: "bg-yellow-50 text-yellow-700" },
        { label: "Approved Goals", value: stats.approvedGoals, color: "bg-green-50 text-green-700" },
        { label: "Total Check-ins", value: stats.totalCheckins, color: "bg-purple-50 text-purple-700" }
    ]

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manager Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Overview of your team's performance
                    </p>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {cards.map((card) => (
                            <div key={card.label} className={`rounded-xl p-5 ${card.color}`}>
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className="text-sm mt-1 font-medium">{card.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-4">
                    
                       <a href="/manager/team-goals"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                        >
                        <h3 className="font-semibold text-gray-800 mb-1">
                            Review Team Goals
                        </h3>
                        <p className="text-sm text-gray-500">
                            Approve or return goals submitted by your team
                        </p>
                    </a>
                    <a
                        href="/manager/team-checkins"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <h3 className="font-semibold text-gray-800 mb-1">
                            Team Check-ins
                        </h3>
                        <p className="text-sm text-gray-500">
                            Review quarterly achievements and add feedback
                        </p>
                    </a>
                </div>

            </div>
        </Layout>
    )
}

export default ManagerDashboard