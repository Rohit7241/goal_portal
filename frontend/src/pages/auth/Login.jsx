import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { useState } from "react"
import { loginApi } from "../../api/authApi"

const Login=()=>{
    const navigate=useNavigate()
    const {login}=useAuth()
    const [formData,setFormData]=useState({
        email="",
        password=""
    })
    const [error,setError]=useState("")
    const [loading,setloading]=useState(false)

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
        setError("")
    }

    const redirectByRole=(role)=>{
        if(role==="employee")navigate("/employee/dashboard")
            else if(role==="manager")navigate("/manager/dashboard")
        else if (role==="admin")navigate("/admin/dashboard")
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setloading(true)
        setError("")

        if(!formData.email||!formData.password){
            setError("Email and password are required")
            setloading(false)
            return
       }
        try{
            const response=await loginApi(formData.email,formData.password)
            login(response.data.user,response.data.token)
            redirectByRole(response.data.user.role)
        }
        catch(err){
            setError(err.reponse?.data?.message||"Login Failed. Try again")
        }
        finally{
            setloading(false)
        }
    }
    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                            GOAL PORTAL
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Sign in to your account
                    </p>
                </div>
                {error&&(
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input type="email"
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="......."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading?"Signing in...":"Sign in"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login