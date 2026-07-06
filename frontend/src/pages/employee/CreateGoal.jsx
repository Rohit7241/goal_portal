import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Layout from "../../../components/Layout.jsx"
import {getAllThrustAreasApi} from "../../api/thrustAreaApi.js";
import {getSingleGoalApi,createGoalApi,editGoalApi} from "../../api/goalApi.js";
const CreateGoal=()=>{
    const navigate=useNavigate()
    const [searchParams]=useSearchParams()
    const editId=searchParams.get("edit")
    const isEditMode=editId
    const [thrustAreas,setThrustAreas]=useState([])
    const [loading,setloading]=useState(false)
    const [error,seterror]=useState("")
    const [success,setsuccess]=useState("")

    const [formData,setFormData]=useState({
        thrust_id:"",
        title:"",
        description:"",
        uom_type:"",
        target_value:"",
        target_date:"",
        weightage:""
    })

    useEffect(()=>{
        const  fetchThrustAreas=async()=>{
            try {
                const res=await getAllThrustAreasApi()
                setThrustAreas(res.data.data||[])
            } catch (error) {
                seterror("Failed to load thrust areas")
            }
        }
        fetchThrustAreas()
    },[])

    useEffect(()=>{
        if(isEditMode){
            const fetchGoal=async()=>{
                try{
                    const res=await getSingleGoalApi(editId)
                    const goal=res.data.data
                    setFormData({
                        thrust_id:goal.thrust_id?._id||"",
                        title:goal.title,
                        description:goal.description,
                        uom_type:goal.uom_type,
                        target_value:goal.target_value||"",
                        target_date:goal.target_date?.slice(0,10)||"",
                        weightage:goal.weightage
                    })
                }
                catch{
                    seterror("Failed to load goal")
                }
            }
            fetchGoal()
        }
    },[editId])
    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
        seterror("")
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setloading(true)
        seterror("")
        setsuccess("")

        if((!formData.thrust_id)||(!formData.title)||(!formData.uom_type)||(!formData.weightage)){
            seterror("Please fill all required fields")
            setloading(false)
            return
        }

        if((!formData.uom_type=="timeline")&&(!formData.target_date)){
            seterror("Target date is required for timeline goals")
            setloading(false)
            return
        }
        if((formData.uom_type !== "timeline") &&( !formData.target_value)){
            seterror("Target value is required")
            setloading(false)
            return
        }

        if(formData.weightage < 10){
            seterror("Minimum weightage is 10%")
            setloading(false)
            return
        }

        try {
            if(isEditMode){
                await editGoalApi(editId, formData)
                setsuccess("Goal updated successfully")
            } else {
                await createGoalApi(formData)
                setsuccess("Goal created successfully")
            }
            setTimeout(() => navigate("/employee/dashboard"), 1000)
        } catch (err) {
            seterror(err.response?.data?.message || "Failed to save goal")
        } finally {
            setloading(false)
        }
    }
    return(
    <Layout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-sm text-gray-800">
                        {isEditMode ? "Edit Goal" : "Create New Goal"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isEditMode ? "Update your goal details" : "Add a new goal to your goal sheet"}
                    </p>
                </div>
                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm p-6">
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

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Thrust Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thrust Area <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="thrust_id"
                                value={formData.thrust_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select thrust area</option>
                                {thrustAreas.map((area) => (
                                    <option key={area._id} value={area._id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Goal Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Increase sales revenue"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the goal in detail"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* UoM Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit of Measurement <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="uom_type"
                                value={formData.uom_type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select UoM type</option>
                                <option value="min">Numeric — Higher is better (e.g. Sales)</option>
                                <option value="max">Numeric — Lower is better (e.g. TAT)</option>
                                <option value="timeline">Timeline — Date based</option>
                                <option value="zero">Zero based (e.g. Accidents)</option>
                            </select>
                        </div>

                        {/* Target — show based on uom_type */}
                        {formData.uom_type && formData.uom_type !== "timeline" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="target_value"
                                    value={formData.target_value}
                                    onChange={handleChange}
                                    placeholder="e.g. 1000000"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {formData.uom_type === "timeline" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="target_date"
                                    value={formData.target_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {/* Weightage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weightage (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="weightage"
                                value={formData.weightage}
                                onChange={handleChange}
                                placeholder="Min 10%, all goals must total 100%"
                                min="10"
                                max="100"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/employee/dashboard")}
                                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : isEditMode ? "Update Goal" : "Create Goal"
                                }
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Layout>
    )
}
export default CreateGoal
