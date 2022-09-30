import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { matchSorter } from 'match-sorter'
import moment from "moment"

const DataTable = ({ filter, search, onClick, data }) => {
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        let temp = data.map((item, index) => {
            if (!filter) return item
            const obj = Object.keys(filter).map((key, index) => {
                switch (typeof filter[key]) {
                    case "string":
                        if (!filter[key]) return item
                        if (item[key].toLowerCase().includes(filter[key])) return item
                
                    case "integer":
                        if (!filter[key]) return item
                        const intTemp = parseInt(item[key][0])
                        if (intTemp >= filter[key][0] && intTemp <= filter[key][1]) return item

                    case "object":
                        
                        return

                    default:
                        break;
                }
            })
            if (obj) return obj
        })
        if (search) temp = matchSorter(temp, search, {keys: ["from", "to", "passenger", "luggage"]})
        setJobs(temp)
    }, [filter, search, data])

    return (
        <div className="px-3">
            {!data?.length && <div className="text-center pt-10 text-xl font-medium">Sorry, there's no job yet.</div>}
            {data?.length > 0 && jobs.map((job, index) => {
                const now = moment(new Date()); //todays date
                const end = moment(job.createdDate); // another date
                const duration = moment.duration(now.diff(end));
                const days = duration.asDays() <= 1 ? duration.asMinutes() <= 60 ? duration.humanize() + " ago" : end.format("HH.mm") : duration.asDays() >= 2 ? end.format("DD/MM/yyyy") : "yesterday";
                console.log(job)
                const bookingInfo = job.bookingInfo
                const dateArray = bookingInfo.start?.pickupDate?.split("/").reverse() || bookingInfo.pickupDate.split("/").reverse()
                const pickupDate = moment(new Date(dateArray[0], dateArray[1], dateArray[2])).format("DD MMM")

                if (job.bookingType === "R&H") {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 py-3 mb-5 rounded-lg">
                            <div className="flex justify-between align-bottom">
                                <div className="font-medium -mb-1">{bookingInfo.start.place}</div>
                                <div className="text-gray-500 text-sm">{days}</div>
                            </div>
                            <FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} />
                            <div className="font-medium mb-1 -mt-1">{bookingInfo.end.place}</div>
                            <div className="flex">
                                <div className="py-1 px-2 font-medium text-sm bg-yellow-600 text-white rounded-md mr-2">{job.bookingType}</div>
                                <div className={"py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-red-600" : "bg-green-700")}>
                                    {bookingInfo.start.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {<div className={"py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-white" : "bg-green-700")}>{bookingInfo.start.pickupTime}</div>}
                                <div className="py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{bookingInfo.passenger}</div>
                                <div className="py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{bookingInfo.luggage}</div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} onClick={(e) => onClick(e, bookingInfo) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 py-3 mb-5 rounded-lg">
                            <div className="flex justify-between align-bottom">
                                <div className="font-medium -mb-1">{bookingInfo.from}</div>
                                <div className="text-gray-500 text-sm">{days}</div>
                            </div>
                            <FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} />
                            <div className="font-medium mb-1 -mt-1">{bookingInfo.to}</div>
                            <div className="flex">
                                <div className="py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2">{job.bookingType}</div>
                                <div className={"py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-red-600" : "bg-green-700")}>
                                    {bookingInfo.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {<div className={"py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-white" : "bg-green-700")}>{bookingInfo.pickupTime}</div>}
                                <div className="py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{bookingInfo.passenger}</div>
                                <div className="py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{bookingInfo.luggage}</div>
                            </div>
                        </div>
                    )
                }
            })}
            <div></div>
        </div>
    )
}

export default DataTable