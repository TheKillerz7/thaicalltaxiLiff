import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'
import moment from "moment"

const BookingHistoryList = ({ onClick, data }) => {

    return (
        <div className="px-3 w-screen">
            {!data?.length && <div className="text-center pt-10 text-xl font-medium">Sorry, there's no booking yet.</div>}
            {data?.length > 0 && data.map((booking, index) => {                
                const bookingInfo = typeof booking.bookingInfo === "string" ? JSON.parse(booking.bookingInfo) : booking.bookingInfo
                const dateArray = bookingInfo.start?.pickupDate?.split("/").reverse() || bookingInfo.pickupDate.split("/").reverse()
                const pickupDate = moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM YYYY")

                if (booking.bookingType === "R&H") {
                    return (
                        <div key={index} onClick={(e) => onClick(e, booking) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className={"font-medium text-sm " + (booking.bookingStatus === "canceled" ? "text-red-600" : "text-green-600")}>{booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}</div>
                                <div className="text-sm font-medium text-gray-600 ml-2">Booking Code: #{(booking.id + 300000).toString().substring(0, 3) + "-" + (booking.id + 300000).toString().substring(3)}</div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-red-600 rounded-full mt-1"></div>
                                </div>
                                <div className="font-semibold">{bookingInfo.start.place.name}</div>
                            </div>
                            <div className="flex mb-1.5">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-blue-800 rounded-full mt-1"></div>
                                </div>
                                <div className="font-semibold">{bookingInfo.end.place.name}</div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-purple-900 text-white rounded-md mr-2">{booking.bookingType}</div>
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-red-600" : "bg-yellow-800")}>
                                    {bookingInfo.start.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {bookingInfo.start.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.start.pickupTime}</div>}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} onClick={(e) => onClick(e, booking) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className={"font-medium text-sm " + (booking.bookingStatus === "canceled" ? "text-red-600" : "text-green-600")}>{booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}</div>
                                <div className="text-sm font-medium text-gray-600 ml-2">Booking Code: #{(booking.id + 300000).toString().substring(0, 3) + "-" + (booking.id + 300000).toString().substring(3)}</div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-red-600 rounded-full mt-1"></div>
                                </div>
                                <div className="font-semibold">{bookingInfo.from.name}</div>
                            </div>
                            <div className="flex mb-1.5">
                                <div className="w-5 mr-2">
                                    <div className="w-4 h-4 border-4 border-blue-800 rounded-full mt-1"></div>
                                </div>
                                <div className="font-semibold">{bookingInfo.to.name}</div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-green-700 text-white rounded-md mr-2">{booking.bookingType}</div>
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-red-600" : "bg-yellow-800")}>
                                    {bookingInfo.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {bookingInfo.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.pickupTime}</div>}
                            </div>
                        </div>
                    )
                }
            })}
            <div></div>
        </div>
    )
}

export default BookingHistoryList