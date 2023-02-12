import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'
import moment from "moment"

const JobHistoryList = ({ onClick, data }) => {

    return (
        <div className="px-3 w-screen">
            {!data?.length && <div className="text-center pt-10 text-xl font-medium">Sorry, there's no job yet.</div>}
            {data?.length > 0 && data.map((job, index) => {                
                const bookingInfo = typeof job.bookingInfo === "string" ? JSON.parse(job.bookingInfo) : job.bookingInfo
                const dateArray = bookingInfo.start?.pickupDate?.split("/").reverse() || bookingInfo.pickupDate.split("/").reverse()
                const pickupDate = moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM YYYY")

                if (job.bookingType === "R&H") {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className={"font-medium text-sm " + (job.bookingStatus === "canceled" ? "text-red-600" : "text-green-600")}>{job.bookingStatus.charAt(0).toUpperCase() + job.bookingStatus.slice(1)}</div>
                                <div className="text-sm font-medium text-gray-600 ml-2">#{(job.id + 300000).toString().splice(3, 0, "-")}</div>
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
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-red-600" : "bg-green-700")}>
                                    {bookingInfo.start.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {bookingInfo.start.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.start.pickupTime}</div>}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className={"font-medium text-sm " + (job.bookingStatus === "canceled" ? "text-red-600" : "text-green-600")}>{job.bookingStatus.charAt(0).toUpperCase() + job.bookingStatus.slice(1)}</div>
                                <div className="text-sm font-medium text-gray-600 ml-2">#{(job.id + 300000).toString().splice(3, 0, "-")}</div>
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
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-red-600" : "bg-green-700")}>
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

export default JobHistoryList