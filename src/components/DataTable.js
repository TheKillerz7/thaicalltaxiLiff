import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { matchSorter } from 'match-sorter'

const DataTable = ({ filter, search, onClick, data }) => {
    const [jobs, setJobs] = useState([])

    useEffect(() => {

    }, [])

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
        console.log(temp)
        if (search) temp = matchSorter(temp, search, {keys: ["from", "to", "passenger", "luggage"]})
        setJobs(temp)
    }, [filter, search, data])

    return (
        <div className="px-3">
            {!data && <div className="text-center pt-10 text-xl font-medium">Sorry, there's no job yet.</div>}
            {data && jobs.map((job, index) => {
                return (
                    <div key={index} onClick={(e) => onClick(e, job) || null} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 py-3 mb-5 rounded-lg">
                        <div className="flex justify-between align-bottom">
                            <div className="font-medium -mb-1">{job.from}</div>
                            <div className="text-gray-500 text-sm">7 minutes ago</div>
                        </div>
                        <FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} />
                        <div className="font-medium mb-1 -mt-1">{job.to}</div>
                        <div style={{ gridTemplateColumns: "1fr 1fr 0.5fr" }} className="grid text-sm">
                            <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faCalendar} />{job.pickupDate}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faClock} />{job.pickupTime}</div>
                        </div>
                        <div style={{ gridTemplateColumns: "1fr 1fr 0.5fr" }} className="grid text-sm">
                            <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faUser} />{job.passenger} people</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faBriefcase} />{job.luggage} luggages</div>
                        </div>
                    </div>
                )
            })}
            <div></div>
        </div>
    )
}

export default DataTable