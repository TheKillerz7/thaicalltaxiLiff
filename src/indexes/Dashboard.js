import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import DriverList from "../pages/dashboard/DriverList"
import DriverRegisters from "../pages/dashboard/DriverRegisters"
import Home from "../pages/dashboard/Home"

const Dashboard = () => {
    const [drivers, setDrivers] = useState()
    const { page } = useParams();
    
    const LinkList = {
        home: <Home />,
        driverList: <DriverList />,
        driverRegisters: <DriverRegisters />,
    }

    useEffect(() => {
        
    }, [])

    return (
        <div className="flex">
            <div style={{ backgroundColor: "#0c143d" }} className="h-screen w-2/12 bg-blue-900 px-5 py-5">
                <Link to="/dashboard/home"><div className="text-xl text-white px-5 py-4 mb-10 cursor-pointer">Dashboard</div></Link>
                <div className="px-5">
                    <div className="text-white mb-7">Driver Management</div>
                    <div className="text-blue-200 text-sm grid gap-y-4">
                        <Link to="/dashboard/driverList"><div className={"transition cursor-pointer font-medium " + (page === "driverList" ? "text-white rounded-md" : "hover:text-gray-100 text-gray-400")}>Driver List</div></Link>
                        <Link to="/dashboard/driverRegisters"><div className={"transition cursor-pointer font-medium " + (page === "driverRegisters" ? "text-white rounded-md" : "hover:text-gray-100 text-gray-400")}>Registration</div></Link>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 w-10/12">
                {LinkList[page]}
            </div>
        </div>
    )
}

export default Dashboard