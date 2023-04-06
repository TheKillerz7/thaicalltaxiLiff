import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import DriverList from "../pages/dashboard/DriverList"
import DriverRegisters from "../pages/dashboard/DriverRegisters"
import Home from "../pages/dashboard/Home"
import BookingList from "../pages/dashboard/BookingList"

const Dashboard = () => {
    const [drivers, setDrivers] = useState()
    const { page } = useParams();
    
    const LinkList = {
        home: <Home />,
        driverList: <DriverList />,
        driverRegisters: <DriverRegisters />,
        bookingList: <BookingList />,
    }

    useEffect(() => {
        
    }, [])

    return (
        <div className="flex">
            <div style={{ backgroundColor: "#0c143d" }} className="sm:block hidden h-screen w-2/12 bg-blue-900 px-5 py-5">
                <Link to="/dashboard/home"><div className="text-xl text-white px-5 py-4 mb-10 cursor-pointer">Dashboard</div></Link>
                <div className="px-5 mb-8">
                    <div className="text-white mb-3">Driver Management</div>
                    <div className="text-blue-200 text-sm grid gap-y-2">
                        <Link to="/dashboard/driverList"><div className={"transition cursor-pointer font-medium " + (page === "driverList" ? "text-white rounded-md" : "hover:text-gray-100 text-gray-400")}>Driver List</div></Link>
                        <Link to="/dashboard/driverRegisters"><div className={"transition cursor-pointer font-medium " + (page === "driverRegisters" ? "text-white rounded-md" : "hover:text-gray-100 text-gray-400")}>Registration</div></Link>
                    </div>
                </div>
                <div className="px-5">
                    <div className="text-white mb-3">Booking Management</div>
                    <div className="text-blue-200 text-sm grid gap-y-2">
                        <Link to="/dashboard/bookingList"><div className={"transition cursor-pointer font-medium " + (page === "driverList" ? "text-white rounded-md" : "hover:text-gray-100 text-gray-400")}>Booking List</div></Link>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 sm:w-10/12 w-full">
                <div style={{ backgroundColor: "#0c143d" }} className="w-full h-16 block sm:hidden px-5 font-semibold text-white flex items-center text-xl">Bell-Man</div>
                {LinkList[page]}
            </div>
        </div>
    )
}

export default Dashboard