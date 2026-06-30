import { useState, useEffect } from "react"
import Layout from "../../../components/Layout.jsx"
import {
    getAllThrustAreasApi,
    createThrustAreaApi,
    updateThrustAreaApi,
    deleteThrustAreaApi
} from "../../api/thrustAreaApi"

const ThrustAreas = () => {

    const [thrustAreas, setThrustAreas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState("")

    const fetchThrustAreas = async () => {
        setLoading(true)
        try {
            const res = await getAllThrustAreasApi()
            setThrustAreas(res.data.data || [])
        } catch {
            setError("Failed to fetch thrust areas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThrustAreas()
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        if(!newName.trim()){
            setError("Name is required")
            return
        }
        try {
            await createThrustAreaApi(newName)
            setSuccess("Thrust area created successfully")
            setNewName("")
            fetchThrustAreas()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create thrust area")
        }
    }

    const startEdit = (area) => {
        setEditingId(area._id)
        setEditName(area.name)
    }

    const saveEdit = async (id) => {
        try {
            await updateThrustAreaApi(id, editName)
            setSuccess("Thrust area updated successfully")
            setEditingId(null)
            fetchThrustAreas()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update thrust area")
        }
    }

    const handleDelete = async (id) => {
        if(!confirm("Are you sure you want to delete this thrust area?")) return
        setError("")
        setSuccess("")
        try {
            await deleteThrustAreaApi(id)
            setSuccess("Thrust area deleted successfully")
            fetchThrustAreas()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete thrust area")
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Thrust Areas</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage company priority categories for goals
                    </p>
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
                <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Revenue Growth, Customer Experience"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Add
                    </button>
                </form>

                {/* List */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : thrustAreas.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No thrust areas yet</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                        {thrustAreas.map((area) => (
                            <div key={area._id} className="flex items-center justify-between px-4 py-3">

                                {editingId === area._id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mr-3"
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium">
                                        {area.name}
                                    </span>
                                )}

                                <div className="flex gap-2">
                                    {editingId === area._id ? (
                                        <>
                                            <button
                                                onClick={() => saveEdit(area._id)}
                                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(area)}
                                                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(area._id)}
                                                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default ThrustAreas