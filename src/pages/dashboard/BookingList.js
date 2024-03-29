import { faMagnifyingGlass, faMars, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { actionToDriver, getAllBooking, getDrivers } from "../../apis/backend"

const BookingList = () => {
    const [bookings, setBookings] = useState([])
    const [onDriverInfo, setOnDriverInfo] = useState(false)
    const [driverInfo, setDriverInfo] = useState([])
    const [onAction, setOnAction] = useState(false)

    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        const callback = async () => {
            const bookingArray = await getAllBooking()
            console.log(bookingArray)
            setBookings(bookingArray.data)
        }
        callback()
    }, [])

    const actionToDriverHandle = async (data) => {
        try {
            await actionToDriver(driverInfo[0].driverId, driverInfo[0]?.driverStatus === "active" ? "ban" : "unban", data[driverInfo[0]?.driverStatus === "active" ? "ban" : "unban"])
            const bookingArray = await getAllBooking()
            setBookings(bookingArray.data)
            alert(driverInfo[0].driverStatus === "active" ? "Ban successful" : "Unban successful")
            setOnDriverInfo(false)
            setOnAction(false)
        } catch (error) {
            console.log(error)
        }
    }

    const acceptHandle = async (data) => {
        try {
            await actionToDriver(driverInfo[0].driverId, "setTL")
            const bookingArray = await getAllBooking()
            setBookings(bookingArray.data)
            alert("Set successful")
            setOnDriverInfo(false)
            reset({id: ""})
            setOnAction("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="h-full sm:px-10 px-5 py-8">
            <div className="text-2xl font-semibold mb-10">Driver Manager</div>
            <div className="bg-white rounded-md py-5 overflow-x-scroll">
                <div className="px-7 flex justify-between items-center mb-5">
                    <div className="font-medium">Driver List</div>
                    <div className="border-2 border-gray-300 rounded-md py-1 px-3 w-3/12 flex items-center">
                        <FontAwesomeIcon className="text-gray-400 mr-2" icon={faMagnifyingGlass} />
                        <input placeholder="Search here..." className="outline-none w-full text-sm" type="text" />
                    </div>
                </div>
                <div style={{ minWidth: "1000px" }} className="overflow-x-scroll ">
                    <div className="bg-gray-50 py-2 px-7 flex">
                        <div className="text-sm font-semibold w-1/12">ID</div>
                        <div className="text-sm font-semibold w-2/12">Name</div>
                        <div className="text-sm font-semibold w-1/12">Sex</div>
                        <div className="text-sm font-semibold w-1/12">Age</div>
                        <div className="text-sm font-semibold w-2/12">Car Type</div>
                        <div className="text-sm font-semibold w-1/12">Job Done</div>
                        <div className="text-sm font-semibold w-2/12">Join Date</div>
                        <div className="text-sm font-semibold w-1/12">Status</div>
                        <div className="text-sm font-semibold w-1/12"></div>
                    </div>
                    {bookings.length > 0 && bookings.map(({ driverCode, personalInfo, vehicleInfo, driverStatus, createdDate, jobAcceptance }, index) => {
                        return (
                            <div key={index} className={"py-2 px-7 flex items-center " + (index + 1 !== bookings.length && "border-b border-gray-200")}>
                                <div className="text-sm w-1/12">{driverCode}</div>
                                <div className="text-sm w-2/12">{personalInfo.name}</div>
                                <div className="text-sm w-1/12">
                                    {personalInfo.title === "Mr." ?
                                        <FontAwesomeIcon className="text-blue-600 text-lg pl-1" icon={faMars} />
                                        :
                                        <FontAwesomeIcon className="text-pink-600 text-lg pl-1" icon={faVenus} />
                                    }
                                </div>
                                <div className="text-sm w-1/12 pl-2">{(new Date().getFullYear() - personalInfo.birth) + 543}</div>
                                <div className="text-sm w-2/12">{vehicleInfo.carType}</div>
                                <div className="text-sm w-1/12">{jobAcceptance}</div>
                                <div className="text-sm w-2/12">{moment(createdDate).format("DD MMM YYYY")}</div>
                                <div className={"text-sm w-1/12 " + (driverStatus === "active" ? "text-green-500" : "text-red-500")}>{driverStatus.charAt(0).toUpperCase() + driverStatus.slice(1)}</div>
                                <div onClick={() => {
                                    setOnDriverInfo(true)
                                    setDriverInfo([bookings[index]])
                                }} className="cursor-pointer text-xs text-white py-2 font-medium w-max px-7 rounded-md text-center bg-blue-900">More</div>
                            </div>
                        )
                    })}
                </div>
                {/* <div className="px-5 h-1/6">
                    <div className="border-t border-gray-300 mb-5"></div>
                    <div className="px-5">
                        <div>1 2 3</div>
                    </div>
                </div> */}
                <div className={"fixed bg-black overflow-y-scroll py-5 w-full h-screen top-0 left-0 bg-opacity-50 grid place-items-center transition " + (onDriverInfo ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    <div className="bg-white w-5/12 rounded-md relative">
                        <div style={{ backgroundColor: "#0c143d" }} className="relative rounded-md px-8 py-5">
                            <div className="text-white mb-7">Driver Info</div>
                            <div className="flex items-center mb-2">
                                <div className="text-white opacity-80 mr-2">#{driverInfo[0]?.driverCode}</div>
                                <div className={"py-1.5 px-3 text-white font-medium text-xs rounded-md " + (driverInfo[0]?.driverStatus === "active" ? "bg-green-600" : "bg-red-600")}>{driverInfo[0]?.driverStatus.charAt(0).toUpperCase() + driverInfo[0]?.driverStatus.slice(1)}</div>
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
                            <div onClick={() => setOnAction("accept")} className="py-2 px-5 cursor-pointer text-sm text-white ml-3 bg-green-600 rounded-md w-max">Set to Team Leader</div>
                            {driverInfo[0]?.driverStatus === "active" ?
                                <div onClick={() => setOnAction("action")} className="py-2 px-5 cursor-pointer text-sm text-white ml-3 bg-red-500 rounded-md w-max">Ban Driver</div>
                                :
                                <div onClick={() => setOnAction("action")} className="py-2 px-5 cursor-pointer text-sm text-white ml-3 bg-red-500 rounded-md w-max">Unban Driver</div>
                            }
                        </div>
                        <div className={"absolute w-full h-full bg-black top-0 left-0 rounded-md bg-opacity-50 grid place-items-center transition " + (onAction === "accept" ? "opacity-100" : "opacity-0 pointer-events-none")}>
                            <form onSubmit={handleSubmit(acceptHandle)} className="bg-white px-4 py-4 sm:w-6/12 w-11/12 rounded-md">
                                <div className="text-lg font-semibold mb-2">Set to Team Leader</div>
                                <div className="grid grid-cols-2 gap-x-2 text-center items-center">
                                    <div onClick={() => setOnAction("")} className="py-2 px-5 cursor-pointer text-xs font-medium bg-gray-300 rounded-md">Close</div>
                                    <button type="submit" style={{ backgroundColor: "#0c143d" }} className="py-2 px-5 cursor-pointer text-xs text-white rounded-md">Send</button>
                                </div>
                            </form>
                        </div>
                        <div className={"absolute w-full h-full bg-black top-0 left-0 rounded-md bg-opacity-50 grid place-items-center transition " + (onAction === "action" ? "opacity-100" : "opacity-0 pointer-events-none")}>
                            <form onSubmit={handleSubmit(actionToDriverHandle)} className="bg-white px-4 py-4 w-6/12 rounded-md">
                                {driverInfo[0]?.driverStatus === "active" ?
                                    <>
                                        <div className="text-lg font-semibold mb-2">Ban Driver</div>
                                        <div className="border-2 border-gray-300 mb-3 rounded-md py-1 px-3 flex items-center w-full">
                                            <textarea {...register("ban")} placeholder="Message..." className="outline-none w-full text-sm" type="text" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 text-center items-center">
                                            <div onClick={() => setOnAction(false)} className="py-2 px-5 cursor-pointer text-xs font-medium bg-gray-300 rounded-md">Close</div>
                                            <button type="submit" style={{ backgroundColor: "#0c143d" }} onClick={() => {}} className="py-2 px-5 cursor-pointer text-xs text-white rounded-md">Send</button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="text-lg font-semibold mb-2">Unban Driver</div>
                                        <div className="border-2 border-gray-300 mb-3 rounded-md py-1 px-3 flex items-center w-full">
                                            <textarea {...register("unban")} placeholder="Message..." className="outline-none w-full text-sm" type="text" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 text-center items-center">
                                            <div onClick={() => setOnAction(false)} className="py-2 px-5 cursor-pointer text-xs font-medium bg-gray-300 rounded-md">Close</div>
                                            <button type="submit" style={{ backgroundColor: "#0c143d" }} onClick={() => {}} className="py-2 px-5 cursor-pointer text-xs text-white rounded-md">Send</button>
                                        </div>
                                    </>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingList