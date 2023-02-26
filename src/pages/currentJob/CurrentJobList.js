import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'
import moment from "moment"

const CurrentJobList = ({ onClick, data }) => {
    const colors = {
        date: ["#1e3a8a", "#c4a335", "#57b330", "#6c1c8a"],
        job: ["#f0f5fc", "#fcfbe1", "#ebffe3", "#f6e3fc"],
        button: ["#4e6cc2", "#c2b64e", "#6dbd48", "#4e6cc2"]
    }
    let dateCount = 0

    const jobs = [...Array(31)].map((count, index) => {
        const bookings = data.map((job, i) => {
            const bookingInfo = typeof job.bookingInfo === "string" ? JSON.parse(job.bookingInfo) : job.bookingInfo
            const date = job.bookingInfo.start?.pickupDate || job.bookingInfo.pickupDate
            console.log(date)
            console.log(moment(new Date().getTime() + (24 * 60 * 60 * 1000 * index)).format("DD/MM/YYYY"))
            if (moment(new Date().getTime() + (24 * 60 * 60 * 1000 * index)).format("DD/MM/YYYY") === date || ((job.bookingInfo.start?.pickupDate || job.bookingInfo.pickupDate === "ASAP") && index === 0)) {             
                if (job.bookingType === "R&H") {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ backgroundColor: dateCount <= 3 ? colors.job[index] : "#ebebeb" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className="text-sm font-medium text-gray-600">#{(job.id + 300000).toString().substring(0, 3) + "-" + (job.id + 300000).toString().substring(3)}</div>
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
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-purple-900 text-white rounded-md mr-2">{job.bookingType}</div>
                                {bookingInfo.start.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.start.pickupTime}</div>}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ backgroundColor: dateCount <= 3 ? colors.job[index] : "#ebebeb" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className="text-sm font-medium text-gray-600">#{(job.id + 300000).toString().substring(0, 3) + "-" + (job.id + 300000).toString().substring(3)}</div>
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
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-green-700 text-white rounded-md mr-2">{job.bookingType}</div>
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "text-white bg-red-600" : "bg-yellow-800")}>{bookingInfo.pickupTime}</div>
                            </div>
                        </div>
                    )
                }
            }
          }).filter(item => item && item)

        if (bookings.length > 0) {
            dateCount += 1
            return (
                <div key={index} className="px-1 mb-8">
                    <div style={{ backgroundColor: dateCount <= 3 ? colors.date[index] : "gray" }} className="px-3 py-2 mb-3 text-lg font-medium rounded-md text-white">{moment(new Date().getTime() + (24 * 60 * 60 * 1000 * index)).format("DD MMM")}</div>
                        {bookings}
                    <div></div>
                </div>
            )
        }
    })

    return (
        <div className="px-3 w-screen">
            {jobs.length <= 0 ? <div className="text-center pt-10 text-xl font-medium">Sorry, there's no job right now.</div>
                :
                jobs
            }
            <div></div>
        </div>
    )
}

export default CurrentJobList