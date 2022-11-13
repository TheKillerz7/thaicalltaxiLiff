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
        <div className="px-3 w-screen">
            {!data?.length && <div className="text-center pt-10 text-xl font-medium">Sorry, there's no job yet.</div>}
            {data?.length > 0 && jobs.map((job, index) => {
                const now = moment(new Date()); //todays date
                const end = moment(job.createdDate); // another date
                const duration = moment.duration(now.diff(end));
                const days = duration.asDays() <= 1 ? 
                    duration.asMinutes() <= 60 ? 
                        duration.asMinutes() <= 1 ? "1 min ago" : duration.humanize().replace("minutes", "mins") + " ago" 
                        : end.format("HH.mm") 
                    : duration.asDays() >= 2 ? end.format("DD/MM/yyyy") : "yesterday";
                
                const bookingInfo = job.bookingInfo
                const dateArray = bookingInfo.start?.pickupDate?.split("/").reverse() || bookingInfo.pickupDate.split("/").reverse()
                const pickupDate = moment(new Date(dateArray[0], dateArray[1], dateArray[2])).format("DD MMM")

                if (job.bookingType === "R&H") {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-ellipsis whitespace-nowrap overflow-hidden w-8/12">{bookingInfo.start.place.name}</div>
                                <div className="text-gray-500 text-sm text-right w-max">{days}</div>
                            </div>
                            <div className="-my-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                            <div className="font-medium mb-1 text-ellipsis whitespace-nowrap overflow-hidden">{bookingInfo.end.place.name}</div>
                            <div className="flex flex-wrap">
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-purple-900 text-white rounded-md mr-2">{job.bookingType}</div>
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-red-600" : "bg-yellow-800")}>
                                    {bookingInfo.start.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {bookingInfo.start.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.start.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.start.pickupTime}</div>}
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{parseInt(bookingInfo.passenger.adult) + parseInt(bookingInfo.passenger.child)}</div>
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{parseInt(bookingInfo.luggage.big) + parseInt(bookingInfo.luggage.medium)}</div>
                                {job.bookingInfo.carType === "Any type" &&<div className="mb-2 py-1 px-2 font-semibold text-sm bg-gray-300 text-gray-700 rounded-md mr-2">{job.bookingInfo.carType}</div>}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 pt-3 pb-1 mb-5 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-ellipsis whitespace-nowrap overflow-hidden w-8/12">{bookingInfo.from.name}</div>
                                <div className="text-gray-500 text-sm text-right w-max">{days}</div>
                            </div>
                            <div className="-my-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                            <div className="font-medium mb-1 text-ellipsis whitespace-nowrap overflow-hidden">{bookingInfo.to.name}</div>
                            <div className="flex flex-wrap">
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-green-700 text-white rounded-md mr-2">{job.bookingType}</div>
                                <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-red-600" : "bg-yellow-800")}>
                                    {bookingInfo.pickupDate === "ASAP" ? "ASAP" : pickupDate}
                                </div>
                                {bookingInfo.pickupDate !== "ASAP" && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + (bookingInfo.pickupDate === "ASAP" ? "bg-white" : "bg-yellow-800")}>{bookingInfo.pickupTime}</div>}
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{parseInt(bookingInfo.passenger.adult) + parseInt(bookingInfo.passenger.child)}</div>
                                <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{parseInt(bookingInfo.luggage.big) + parseInt(bookingInfo.luggage.medium)}</div>
                                {job.bookingInfo.carType === "Any type" &&<div className="mb-2 py-1 px-2 font-semibold text-sm bg-gray-300 text-gray-700 rounded-md mr-2">{job.bookingInfo.carType}</div>}
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