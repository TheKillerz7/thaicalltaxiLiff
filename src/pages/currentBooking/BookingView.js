import { faArrowDown, faArrowLeft, faArrowRight, faBriefcase, faCalendar, faCalendarCheck, faClock, faTags, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import NumberInput from "../../components/Numberinput"
import { useForm } from "react-hook-form";
import Textinput from "../../components/Textinput";
import { cancelBooking, driverRegisterToBooking, getSelectedRegisterByBookingId } from "../../apis/backend";
import moment from "moment";
import Textareainput from "../../components/Textareainput";
import he from "he"
import { translations } from "../../apis/google";
import { Link } from "react-router-dom";

const BookingView = ({ bookingData, currentJobs, isOpen, onClick, userId, setJobOpen }) => {
    const [applyProcess, setApplyProcess] = useState("")
    const [price, setPrice] = useState({})
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const { register, setValue, handleSubmit, unregister } = useForm()

    const dateArray = isOpen && (bookingData.bookingInfo.start?.pickupDate.split("/").reverse() || bookingData.bookingInfo.pickupDate.split("/").reverse())
    const pickupDate = isOpen && moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM")

    useEffect(() => {
        const JobBoard = document.querySelector('#job')
        if (!isOpen) return enableBodyScroll(JobBoard)
        setApplyProcess("")
        console.log(bookingData)
    }, [isOpen])

    useEffect(() => {
        const callback = async () => {
            const prices = (await getSelectedRegisterByBookingId(bookingData.bookingId)).data[0]
            const priceObj = {}
            if (prices) {
                prices.extra = JSON.parse(prices.extra)
                prices.extra.forEach((extra, index) => {
                    priceObj[extra.title] = parseInt(extra.price)
                })
                let totalPrice = 0
                Object.keys(priceObj).forEach((item, index) => {
                    totalPrice += priceObj[item]
                })
                totalPrice += parseInt(prices.course)
                totalPrice += parseInt(prices.tollway)
                setTotal(totalPrice)
                setPrice({...priceObj})
            }
        }
        callback()
    }, [])

    const handleCancelBooking = async () => {
        await cancelBooking(bookingData.bookingId, userId)
        alert("Booking has been canceled.")
        setJobOpen(false)
        setApplyProcess("")
    }

    return (
        <div style={{ transitionTimingFunction: "cubic-bezier(.3,.18,.34,1)", transitionDuration: "350ms", overflowY: "scroll" }} className={"fixed bg-white h-screen w-full top-0 transition " + (!isOpen && "translate-x-full")}>
            {isOpen && <div className="relative">
                <div style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }} onClick={onClick || null} className="text-xl border-b border-gray-400 py-5 px-5">
                    <FontAwesomeIcon className="text-blue-900 mr-4" icon={faArrowLeft} />
                    Current Booking
                </div>
                <div>
                    <div className="px-5 pt-5 bg-white pb-3">
                        <div className="mb-2">
                            <div className="text-xl font-semibold">{bookingData.bookingInfo.start?.place.name || bookingData.bookingInfo.from.name}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                            {bookingData.bookingType === "R&H" && bookingData.bookingInfo.visit.length && (
                                <div>
                                    <div>
                                        {bookingData.bookingInfo.visit.map((place, index) => {
                                            return (
                                                <div className="text-lg flex items-center">
                                                    <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 rounded-full border-yellow-600 font-bold mr-2">
                                                        {index !== 0 && <div className="absolute bottom-full h-5 left-1/2 -translate-x-1/2 w-1 bg-yellow-600"></div>}
                                                    </div>
                                                    {place.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                </div>
                            )}
                            <div className="text-xl font-semibold">{bookingData.bookingInfo.end?.place.name || bookingData.bookingInfo.to.name}</div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingData.bookingType === "A2B" ? "bg-green-700" : "bg-yellow-600")}>{bookingData.bookingType}</div>
                            <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + ((bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "bg-red-600" : "bg-yellow-800")}>
                                {(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "ASAP" : pickupDate}
                            </div>
                            {!(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-yellow-800"}>{bookingData.bookingInfo.start?.pickupTime || bookingData.bookingInfo.pickupTime}</div>}
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.adult}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.child}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.big}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.medium}</div>
                        </div>
                        {bookingData.bookingInfo.message.en && <div className="mt-1 font-medium text-lg text-yellow-600">You: "{bookingData.bookingInfo.message.en}"</div>}
                        {price?.message?.en && <div className="mt-1 font-medium text-lg text-yellow-600">Driver: "{price.message.en}"</div>}
                    </div>
                </div>
                <div className="px-5 mt-3">
                    <div className="mb-10">
                        <div style={{ aspectRatio: "7 / 5" }} className="bg-gray-500 rounded-md w-full text-white grid place-items-center mb-3">
                            <iframe
                                height="250"
                                className="w-full rounded-md"
                                src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBbjxIWcwiaWvTlPuPn9lzOMhJCEwYAhu0&origin=place_id:${bookingData.bookingInfo.start?.place.placeId || bookingData.bookingInfo.from?.placeId}&destination=place_id:${bookingData.bookingInfo.end?.place.placeId || bookingData.bookingInfo.to?.placeId}`}
                            >
                            </iframe>
                        </div>
                    </div>
                        <div className="mb-10">
                            <div>
                                <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faTags} /></span>Price</div>
                                <div className="bg-blue-50 rounded-lg relative">
                                    <form className="border-b-2 border-gray-400 h-full w-full border-dashed py-4 px-4">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">
                                                        Course
                                                    </td>
                                                    <td className="align-middle pl-3 w-7/12">
                                                        {"฿" + price.course}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">
                                                        Tollway
                                                    </td>
                                                    <td className="align-middle pl-3 w-7/12">
                                                        {"฿" + price.tollway}
                                                    </td>
                                                </tr>
                                                {Object.keys(price).map((item, index) => {
                                                    return (
                                                        <tr key={item}>
                                                            <td className="align-middle whitespace-nowrap font-medium">
                                                                {item}
                                                            </td>
                                                            <td className="align-middle pl-3 w-7/12">
                                                                {"฿" + price.extra[index].price}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
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
                                <div className="flex bg-blue-50 rounded-md py-3 px-4 mb-5">
                                    <div className="text-lg font-semibold mr-2">Total:</div>
                                    <div className="text-lg font-semibold text-green-600">฿ {total}</div>
                                </div>
                            </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3">
                        <div onClick={() => setApplyProcess("confirmation")} className="cursor-pointer bg-red-600 rounded-md text-white font-medium w-full py-2 grid place-items-center mb-10">Cancel Booking</div>
                        <Link to={`/chat/user/inbox`}><div className="cursor-pointer bg-blue-900 rounded-md text-white font-medium w-full py-2 grid place-items-center mb-10">Chatroom</div></Link>
                    </div>
                </div>
                {applyProcess !== "offering" && <ApplicationConfirmation applyProcess={applyProcess} setApplyProcess={setApplyProcess} handleCancelBooking={handleCancelBooking} />}
            </div>}
        </div>
    )
}

export default BookingView

const ApplicationConfirmation = ({ applyProcess, setApplyProcess, handleCancelBooking }) => {
    return (
        <div className={"fixed top-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-40 w-full h-screen transition " + (applyProcess ? "opacity-100" : "opacity-0 pointer-events-none")}>
            {applyProcess === "confirmation" &&
                <>
                    <div className="bg-white w-10/12 mx-auto rounded-t-md py-6 px-5">
                        <div className="text-xl font-semibold mb-3">Are you sure?</div>
                        <div>
                            If you cancel, this booking will be removed permanently.
                        </div>
                    </div>
                    <div className="bg-gray-100 w-10/12 flex items-center justify-end mx-auto rounded-b-md py-3 px-5">
                        <div onClick={() => setApplyProcess("")} className="cursor-pointer text-gray-500 border border-gray-500 rounded-md py-1 px-4 mr-3">No</div>
                        <div onClick={handleCancelBooking} className="cursor-pointer text-white border border-red-600 bg-red-600 rounded-md py-1 px-4">Yes</div>
                    </div>
                </>
            }
        </div>
    )
}