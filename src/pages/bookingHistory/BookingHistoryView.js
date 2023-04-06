import { faArrowDown, faArrowLeft, faArrowRight, faBriefcase, faCalendar, faCalendarCheck, faClock, faTags, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import NumberInput from "../../components/Numberinput"
import { useForm } from "react-hook-form";
import Textinput from "../../components/Textinput";
import { cancelBooking, driverRegisterToBooking, getDriverById, getSelectedRegisterByBookingId } from "../../apis/backend";
import moment from "moment";
import Textareainput from "../../components/Textareainput";
import he from "he"
import { translations } from "../../apis/google";
import { Link } from "react-router-dom";

const BookingHistoryView = ({ bookingData, currentJobs, isOpen, onClick, userId, setJobOpen }) => {
    const [applyProcess, setApplyProcess] = useState("")
    const [price, setPrice] = useState({})
    const [prices, setPrices] = useState({})
    const [driver, setDriver] = useState({})
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const dateArray = isOpen && (bookingData.bookingInfo.start?.pickupDate.split("/").reverse() || bookingData.bookingInfo.pickupDate.split("/").reverse())
    let pickupEndDate
    if (isOpen && bookingData.bookingType === "R&H") {
        const endDateArray =  bookingData.bookingInfo.end.pickupDate.split("/").reverse()
        pickupEndDate = moment(new Date(endDateArray[0], (parseInt(endDateArray[1]) - 1).toString(), endDateArray[2])).format("DD MMM")
    }
    const pickupDate = isOpen && moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM")

    useEffect(() => {
        const JobBoard = document.querySelector('#job')
        if (!isOpen) return enableBodyScroll(JobBoard)
        setApplyProcess("")
        const callback = async () => {
            const prices = (await getSelectedRegisterByBookingId(bookingData.bookingId)).data[0]
            const drivers = (await getDriverById(prices.driverId)).data[0]
            drivers.personalInfo = JSON.parse(drivers.personalInfo)
            drivers.vehicleInfo = JSON.parse(drivers.vehicleInfo)
            prices.message = JSON.parse(prices.message)
            setDriver(drivers)
            console.log(prices)
            if (prices) {
                let totalPrice = 0
                totalPrice += parseInt(prices.course)
                setTotal(totalPrice)
                setPrices(prices)
            }
        }
        callback()
    }, [isOpen])

    return (
        <div style={{ transitionTimingFunction: "cubic-bezier(.3,.18,.34,1)", transitionDuration: "350ms", overflowY: "scroll" }} className={"fixed bg-white h-screen w-full top-0 transition " + (!isOpen && "translate-x-full")}>
            {isOpen && <div className="relative">
                <div style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }} onClick={onClick || null} className="text-xl border-b border-gray-400 py-5 px-5">
                    <FontAwesomeIcon className="text-blue-900 mr-4" icon={faArrowLeft} />
                    Booking History
                </div>
                <div>
                    <div className="px-5 pt-5 bg-white pb-3">
                        <div className="mb-2">
                            <div className="flex items-center mb-2">
                                <div className={"text-lg font-medium " + (bookingData.bookingStatus === "canceled" ? "text-red-600" : "text-green-600")}>{bookingData.bookingStatus.charAt(0).toUpperCase() + bookingData.bookingStatus.slice(1)}</div>
                                <div className="font-medium text-gray-600 ml-2 mt-0.5">#{(bookingData.id + 300000).toString().substring(0, 3) + "-" + (bookingData.id + 300000).toString().substring(3)}</div>
                            </div>
                            <div className="flex mb-1.5">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-red-600 rounded-full mt-2"></div>
                                </div>
                                <div className="text-xl font-semibold">{bookingData.bookingInfo.start?.place.name || bookingData.bookingInfo.from.name}</div>
                            </div>
                            {bookingData.bookingType === "R&H" && bookingData.bookingInfo.visit.length && (
                                <div className="mb-1.5">
                                    <div>
                                        {bookingData.bookingInfo.visit.map((place, index) => {
                                            return (
                                                <div className="text-lg flex items-start">
                                                    <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 mt-1.5 rounded-full border-yellow-600 font-bold mr-2">
                                                    </div>
                                                    {place.place.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="flex ">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-blue-800 rounded-full mt-2"></div>
                                </div>
                                <div className="text-xl font-semibold">{bookingData.bookingInfo.end?.place.name || bookingData.bookingInfo.to.name}</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + ((bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "bg-red-600" : "bg-yellow-800")}>
                                {(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "ASAP" : pickupDate}
                            </div>
                            {!(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-yellow-800"}>{bookingData.bookingInfo.start?.pickupTime || bookingData.bookingInfo.pickupTime}</div>}
                            {bookingData.bookingType === "R&H" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-yellow-800"}>{bookingData.bookingInfo.end.pickupTime}</div>}
                            {bookingData.bookingType === "R&H" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-yellow-800"}>{pickupEndDate}</div>}
                        </div>
                        <div className="flex flex-wrap">
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.adult}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.child}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.big}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md mr-2"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.medium}</div>
                            {bookingData.bookingInfo.preferedCarType && <div className="mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-green-700">{bookingData.bookingInfo.preferedCarType !== "VIP Van" ? Array.from(bookingData.bookingInfo.preferedCarType)[0] + "+" : "VV+"}</div>}
                        </div>
                        {bookingData.bookingInfo.message.en && <div className="mt-1 font-semibold text-lg">Your message: "{bookingData.bookingInfo.message.en}"</div>}
                        {prices?.message?.en && <div className="mt-2 font-semibold text-lg">OP Msg: "{prices.message.en}"</div>}
                    </div>
                </div>
                <div className="px-5 mt-3">
                        <div className="mb-10">
                            <div>
                                <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faTags} /></span>Price</div>
                                <div className="bg-blue-50 rounded-lg relative">
                                    <form className="border-b-2 border-gray-400 h-full w-full border-dashed py-4 px-4">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">
                                                        Course:
                                                    </td>
                                                    <td className="align-middle pl-3 w-7/12">
                                                        {"฿" + prices?.course}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                    <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full left-0 -translate-y-1/2 -translate-x-1/2 rounded-full">
                                        <div style={{ left: "-2px" }} className="absolute w-5 h-10 bg-white -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    </div>
                                    <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full right-0 -translate-y-1/2 translate-x-1/2 rounded-full">
                                        <div className="absolute w-5 h-10 bg-white translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-md py-3 px-4 mb-5">
                                    <div className="flex">
                                        <div className="text-lg font-semibold mr-2">Total:</div>
                                        <div className="text-lg font-semibold text-green-600">฿ {total}</div>
                                    </div>
                                    <div className="mt-2 text-sm"><span className="font-medium">*Include:</span> Gas, User's Extra Orders,<br/>Toll (Except DMK Tollway)</div>
                                </div>
                            </div>
                    </div>
                    <div className="mb-10">
                        <div>
                            <div className="text-xl text-left font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faTags} /></span>Driver Info</div>
                            <div className="bg-blue-50 rounded-lg relative mt-3">
                                <form className="h-full w-full py-4 px-4">
                                <table>
                                        <tbody>
                                            <tr>
                                                <td className="align-middle whitespace-nowrap font-semibold">
                                                    Driver Code
                                                </td>
                                                <td className="align-middle pl-3 w-7/12">
                                                    {"#" + driver?.driverCode}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle whitespace-nowrap font-semibold">
                                                    Car Type
                                                </td>
                                                <td className="align-middle pl-3 w-7/12">
                                                    {driver?.vehicleInfo?.carType}
                                                </td>
                                            </tr>
                                            {prices.message?.en && 
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-semibold">
                                                        Message
                                                    </td>
                                                    <td className="align-middle pl-3 w-7/12 text-yellow-600 font-medium">
                                                        {'"' + prices.message?.en + '"'}
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-2 gap-x-3">
                        <div onClick={() => setApplyProcess("confirmation")} className="cursor-pointer bg-red-600 rounded-md text-white font-medium w-full py-2 grid place-items-center mb-10">Cancel Booking</div>
                        <Link to={`/chat/user/inbox`}><div className="cursor-pointer bg-blue-900 rounded-md text-white font-medium w-full py-2 grid place-items-center mb-10">Chatroom</div></Link>
                    </div> */}
                </div>
            </div>}
        </div>
    )
}

export default BookingHistoryView