import { faMagnifyingGlass, faMars, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { actionToDriver, getDrivers } from "../../apis/backend"
import Textareainput from "../../components/Textareainput"

const DriverRegisters = () => {
    const [drivers, setDrivers] = useState([])
    const [onDriverInfo, setOnDriverInfo] = useState(false)
    const [driverInfo, setDriverInfo] = useState([])
    const [onAction, setOnAction] = useState("")

    const { register, handleSubmit } = useForm()

    useEffect(() => {
        const callback = async () => {
            const driversArray = await getDrivers("where", {title: "driverStatus", value: "registering"})
            console.log(driversArray)
            setDrivers(driversArray.data)
        }
        callback()
    }, [])

    const rejectHandle = async (data) => {
        try {
            await actionToDriver(driverInfo[0].driverId, "reject", data.reject)
            const driversArray = await getDrivers("where", {title: "driverStatus", value: "registering"})
            setDrivers(driversArray.data)
            alert("Reject successful")
            setOnDriverInfo(false)
            setOnAction(false)
        } catch (error) {
            console.log(error)
        }
    }

    const acceptHandle = async (data) => {
        try {
            await actionToDriver(driverInfo[0].driverId, "accept", data.accept)
            const driversArray = await getDrivers("where", {title: "driverStatus", value: "registering"})
            setDrivers(driversArray.data)
            alert("Accept successful")
            setOnDriverInfo(false)
            setOnAction("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="h-full sm:px-10 px-5 py-8">
            <div className="text-2xl font-semibold mb-10">Registration Manager</div>
            <div className="bg-white rounded-md py-5 overflow-x-scroll">
                <div className="px-7 flex justify-between items-center mb-5">
                    <div className="font-medium">Registration Request</div>
                    <div className="border-2 border-gray-300 rounded-md py-1 px-3 w-3/12 flex items-center">
                        <FontAwesomeIcon className="text-gray-400 mr-2" icon={faMagnifyingGlass} />
                        <input placeholder="Search here..." className="outline-none w-full text-sm" type="text" />
                    </div>
                </div>
                <div style={{ minWidth: "1000px" }} className="overflow-x-scroll ">
                    <div className="bg-gray-50 py-2 px-7 flex">
                        <div className="text-sm font-semibold w-2/12">Name</div>
                        <div className="text-sm font-semibold w-1/12">Sex</div>
                        <div className="text-sm font-semibold w-1/12">Age</div>
                        <div className="text-sm font-semibold w-2/12">Car Type</div>
                        <div className="text-sm font-semibold w-2/12">Car Model</div>
                        <div className="text-sm font-semibold w-1/12">Car Birth</div>
                        <div className="text-sm font-semibold w-1/12">Plate Color</div>
                        <div className="text-sm font-semibold w-1/12">Insurance</div>
                        <div className="text-sm font-semibold w-1/12"></div>
                    </div>
                    {drivers.length > 0 && drivers.map(({ personalInfo, vehicleInfo }, index) => {
                        return (
                            <div key={index} className={"py-2 px-7 flex items-center " + (index + 1 !== drivers.length && "border-b border-gray-200")}>
                                <div className="text-sm w-2/12">{personalInfo.name}</div>
                                <div className="text-sm w-1/12">
                                    {personalInfo.title === "Mr." ?
                                        <FontAwesomeIcon className="text-blue-600 text-lg pl-1" icon={faMars} />
                                        :
                                        <FontAwesomeIcon className="text-pink-600 text-lg pl-1" icon={faVenus} />
                                    }
                                </div>
                                <div className="text-sm w-1/12 pl-2">{new Date().getFullYear() - personalInfo.birth}</div>
                                <div className="text-sm w-2/12">{vehicleInfo.carType}</div>
                                <div className="text-sm w-2/12">{vehicleInfo.carModel}</div>
                                <div className="text-sm w-1/12">{vehicleInfo.birth}</div>
                                <div className="text-sm w-1/12">{vehicleInfo.plateColor}</div>
                                <div className="text-sm w-1/12">{vehicleInfo.insurance}</div>
                                <div onClick={() => {
                                    setOnDriverInfo(true)
                                    setDriverInfo([drivers[index]])
                                }} className="cursor-pointer text-xs text-white py-2 font-medium w-max px-7 rounded-md text-center bg-blue-900">More</div>
                            </div>
                        )
                    })}
                </div>
                {/* <div className="px-5">
                    <div className="border-t border-gray-300 mb-5"></div>
                    <div className="px-5">
                        <div>1 2 3</div>
                    </div>
                </div> */}
            </div>
            <div className={"fixed bg-black w-full h-screen overflow-y-scroll top-0 left-0 bg-opacity-50 grid place-items-center transition " + (onDriverInfo ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <div className="relative bg-white sm:w-5/12 w-11/12 rounded-md">
                    <div style={{ backgroundColor: "#0c143d" }} className="relative rounded-md px-8 py-5">
                        <div className="text-white mb-7">Driver Info</div>
                        <div className="flex items-center mb-2">
                            <div className="py-1 px-3 text-white font-medium text-sm rounded-md bg-orange-600">Pending</div>
                        </div>
                        <div className="text-2xl text-white">{driverInfo[0]?.personalInfo.title}{driverInfo[0]?.personalInfo.name} <span className="text-lg opacity-80 ml-1">{new Date().getFullYear() - driverInfo[0]?.personalInfo.birth} years old</span></div>
                        <div onClick={() => setOnDriverInfo(false)} className="text-2xl font-medium absolute text-white cursor-pointer top-4 right-5">x</div>
                    </div>
                    <div className="bg-white rounded-md px-8 py-5 grid grid-cols-2 mb-2">
                        <div className="pr-8">
                            <div className="text-xl font-medium mb-5">Personal Info</div>
                            <div className="mb-4">
                                <div className="text-sm">Citizen ID</div>
                                <div className="font-medium">{driverInfo[0]?.personalInfo.citizenId}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Driver License</div>
                                <div className="font-medium">{driverInfo[0]?.personalInfo.driverLicenseType}, {driverInfo[0]?.personalInfo.driverLicense}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Contact</div>
                                {driverInfo[0] && driverInfo[0].personalInfo.contact.map(({ title, id }, index) => {
                                    return (
                                        <div className="font-medium">{title} - {id}</div>
                                    )
                                })}
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Address</div>
                                <div className="font-medium">{driverInfo[0]?.personalInfo.address}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Urgent Contact</div>
                                <div className="font-medium">{driverInfo[0]?.personalInfo.title} - {driverInfo[0]?.personalInfo.title}</div>
                            </div>
                        </div>
                        <div className="pl-8">
                            <div className="text-xl font-medium mb-5">Vehicle Info</div>
                            <div className="mb-4">
                                <div className="text-sm">Car Type</div>
                                <div className="font-medium">{driverInfo[0]?.vehicleInfo.carType}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Car Model</div>
                                <div className="font-medium">{driverInfo[0]?.vehicleInfo.carModel}, {driverInfo[0]?.vehicleInfo.carBirth}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Plate</div>
                                <div className="font-medium">{driverInfo[0]?.vehicleInfo.plateColor}, {driverInfo[0]?.vehicleInfo.plateNo}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm">Insurance</div>
                                <div className="font-medium">{driverInfo[0]?.vehicleInfo.insurance}</div>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 pb-4 mb-5">
                        <div className="text-xl font-medium mb-5">Image Evidence</div>
                        <div className="grid grid-cols-4 gap-x-4">
                            <div>
                                <div className="mb-2 font-medium">Driver License</div>
                                <div style={{ aspectRatio: "1" }} className="bg-gray-600 rounded-md cursor-pointer"></div>
                            </div>
                            <div>
                                <div className="mb-2 font-medium">Driver License</div>
                                <div style={{ aspectRatio: "1" }} className="bg-gray-600 rounded-md cursor-pointer"></div>
                            </div>
                            <div>
                                <div className="mb-2 font-medium">Driver License</div>
                                <div style={{ aspectRatio: "1" }} className="bg-gray-600 rounded-md cursor-pointer"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center px-8 py-4">
                        <div onClick={() => setOnAction("reject")} className="py-2 px-5 cursor-pointer text-sm text-white bg-red-500 rounded-md w-max">Reject</div>
                        <div onClick={() => setOnAction("accept")} className="py-2 px-5 cursor-pointer text-sm text-white ml-3 bg-green-600 rounded-md w-max">Accept</div>
                    </div>
                    <div className={"absolute w-full h-full bg-black top-0 left-0 rounded-md bg-opacity-50 grid place-items-center transition " + (onAction === "reject" ? "opacity-100" : "opacity-0 pointer-events-none")}>
                        <form onSubmit={handleSubmit(rejectHandle)} className="bg-white px-4 py-4 w-6/12 rounded-md">
                            <div className="text-lg font-semibold mb-2">Rejection</div>
                            <div className="border-2 border-gray-300 mb-3 rounded-md py-1 px-3 flex items-center w-full">
                                <textarea {...register("reject")} placeholder="Message..." className="outline-none w-full text-sm" type="text" />
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 text-center items-center">
                                <div onClick={() => setOnAction("")} className="py-2 px-5 cursor-pointer text-xs font-medium bg-gray-300 rounded-md">Close</div>
                                <button type="submit" style={{ backgroundColor: "#0c143d" }} className="py-2 px-5 cursor-pointer text-xs text-white rounded-md">Send</button>
                            </div>
                        </form>
                    </div>
                    <div className={"absolute w-full h-full bg-black top-0 left-0 rounded-md bg-opacity-50 grid place-items-center transition " + (onAction === "accept" ? "opacity-100" : "opacity-0 pointer-events-none")}>
                        <form onSubmit={handleSubmit(acceptHandle)} className="bg-white px-4 py-4 sm:w-6/12 w-11/12 rounded-md">
                            <div className="text-lg font-semibold mb-2">Acception</div>
                            <div className="border-2 border-gray-300 mb-3 rounded-md py-1 px-3 flex items-center w-full">
                                <input {...register("accept")} placeholder="Driver Code..." className="outline-none w-full text-sm" type="text" />
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 text-center items-center">
                                <div onClick={() => setOnAction("")} className="py-2 px-5 cursor-pointer text-xs font-medium bg-gray-300 rounded-md">Close</div>
                                <button type="submit" style={{ backgroundColor: "#0c143d" }} className="py-2 px-5 cursor-pointer text-xs text-white rounded-md">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverRegisters