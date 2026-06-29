import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
                    <h2 className="text-gray-600 text-sm">
                        Goal Setting Portal
                    </h2>
                </div>
                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    )
}

export default Layout