import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faCalendar, faUser, faBriefcase, faClock } from '@fortawesome/free-solid-svg-icons'

const DataTable = ({ filter, sort }) => {
    const data = [
        {
            from: "Kingbap Thailand",
            to: "Marriotte Thailand",
            pickupDate: "25/10/23",
            pickupTime: "11:30",
            passenger: "8 people",
            luggage: "6 luggages"
        },
        {
            from: "Kingbap Thailand",
            to: "Marriotte Thailand",
            pickupDate: "25/10/23",
            pickupTime: "11:30",
            passenger: "8 people",
            luggage: "6 luggages"
        },
        {
            from: "Kingbap Thailand",
            to: "Marriotte Thailand",
            pickupDate: "25/10/23",
            pickupTime: "11:30",
            passenger: "8 people",
            luggage: "6 luggages"
        },
        {
            from: "Kingbap Thailand",
            to: "Marriotte Thailand",
            pickupDate: "25/10/23",
            pickupTime: "11:30",
            passenger: "8 people",
            luggage: "6 luggages"
        },
        {
            from: "Kingbap Thailand",
            to: "Marriotte Thailand",
            pickupDate: "25/10/23",
            pickupTime: "11:30",
            passenger: "8 people",
            luggage: "6 luggages"
        },
    ]

    return (
        <div className="px-3">
            {data.map((booking, index) => {
                return (
                    <div key={index} style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.15)" }} className="px-5 py-3 mb-5 rounded-lg">
                        <div className="flex justify-between align-bottom">
                            <div className="font-medium -mb-1">{booking.from}</div>
                            <div className="text-gray-500 text-sm">7 minutes ago</div>
                        </div>
                        <FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} />
                        <div className="font-medium mb-1 -mt-1">{booking.to}</div>
                        <div className="flex text-sm">
                            <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faCalendar} />{booking.pickupDate}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faClock} />{booking.pickupTime}</div>
                        </div>
                        <div className="flex text-sm">
                            <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faUser} />{booking.passenger}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faBriefcase} />{booking.luggage}</div>
                        </div>
                    </div>
                )
            })}
            <div></div>
        </div>
    )
}

export default DataTable