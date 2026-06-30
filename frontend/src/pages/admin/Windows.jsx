import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import {
    getAllWindowsApi,
    createWindowApi,
    activateWindowApi,
    deactivateWindowApi
} from "../../api/adminApi"

const Windows = () => {

    const [windows, setWindows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        quarter: "Q1",
        year: new Date().getFullYear(),
        opens_on: "",
        closes_on: ""
    })

    const fetchWindows = async () => {
        setLoading(true)
        try {
            const res = await getAllWindowsApi()
            setWindows(res.data.data || [])
        } catch {
            setError("Failed to fetch windows")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWindows()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        try {
            await createWindowApi(formData)
            setSuccess("Window created successfully")
            setShowForm(false)
            setFormData({ quarter: "Q1", year: new Date().getFullYear(), opens_on: "", closes_on: "" })
            fetchWindows()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create window")
        }
    }

    const handleActivate = async (id) => {
        setError("")
        setSuccess("")
        try {
            await activateWindowApi(id)
            setSuccess("Window activated successfully")
            fetchWindows()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to activate window")
        }
    }

    const handleDeactivate = async (id) => {
        setError("")
        setSuccess("")
        try {
            await deactivateWindowApi(id)
            setSuccess("Window deactivated successfully")
            fetchWindows()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to deactivate window")
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Check-in Windows</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage quarterly check-in windows
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        {showForm ? "Cancel" : "+ New Window"}
                    </button>
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

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
                                <select
                                    name="quarter"
                                    value={formData.quarter}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                >
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opens On</label>
                                <input
                                    type="date"
                                    name="opens_on"
                                    value={formData.opens_on}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Closes On</label>
                                <input
                                    type="date"
                                    name="closes_on"
                                    value={formData.closes_on}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
                            >
                                Create Window
                            </button>
                        </form>
                    </div>
                )}

                {/* Windows List */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : windows.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No windows created yet</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Quarter</th>
                                    <th className="px-4 py-3 text-left">Year</th>
                                    <th className="px-4 py-3 text-left">Opens</th>
                                    <th className="px-4 py-3 text-left">Closes</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {windows.map((window) => (
                                    <tr key={window._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {window.quarter}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {window.year}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(window.opens_on).toDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(window.closes_on).toDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                window.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}>
                                                {window.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {window.is_active ? (
                                                <button
                                                    onClick={() => handleDeactivate(window._id)}
                                                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(window._id)}
                                                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                                                >
                                                    Activate
                                                </button>
                                            )}
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

export default Windows