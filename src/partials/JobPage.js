import { faArrowDown, faArrowLeft, faArrowRight, faBriefcase, faCalendar, faCalendarCheck, faClock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const JobPage = ({ bookingData, currentJobs, isOpen, onClick }) => {
    const [applyProcess, setApplyProcess] = useState("")
    
    const { distance, travelTime } = {
        distance: "25 km",
        travelTime: "1 hr 25 mins"
    }
    // useGeocode()

    currentJobs = [
        {
            pickupDate: "12/05/2105",
            pickupTIme: "20:10",
            from: "Pattaya hotel",
            to: "Bangkok hotel"
        },
        {
            pickupDate: "12/05/2105",
            pickupTIme: "20:10",
            from: "Pattaya hotel",
            to: "Bangkok hotel"
        },
        {
            pickupDate: "12/05/2105",
            pickupTIme: "20:10",
            from: "Pattaya hotel",
            to: "Bangkok hotel"
        }
    ]

    // bookingData = {
    //     bookingId: "10262648",
    //     from: "Kingbap Thailand",
    //     to: "Mariotte Thailand",
    //     pickupDate: "27/02/2546",
    //     pickupTime: "19:50",
    //     passenger: "8 people",
    //     luggage: "4 luggages"
    // }

    useEffect(() => {
        const JobBoard = document.querySelector('#job')
        if(isOpen) disableBodyScroll(JobBoard)
        else enableBodyScroll(JobBoard)
        return () => clearAllBodyScrollLocks()
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const el = document.querySelector("#headJob")
        const observer = new IntersectionObserver( 
            ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
            { threshold: [1] }
        );

        observer.observe(el);
        return () => observer.disconnect()
    }, [])

    return (
        <div style={{ transitionTimingFunction: "cubic-bezier(.3,.18,.34,1)", transitionDuration: "350ms", overflowY: "scroll" }} className={"fixed bg-white h-screen w-full top-0 transition " + (!isOpen && "translate-x-full")}>
            <div className="relative">
                <div style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)" }} onClick={onClick || null} className="text-xl py-5 px-5">
                    <FontAwesomeIcon className="text-blue-900 mr-4" icon={faArrowLeft} />
                    Jobs Board
                </div>
                <div id="headJob" className="sticky -top-1 transition-all duration-400">
                    <div className="px-5 pt-8 bg-white pb-3">
                        <div className="text-gray-500 mb-2 font-medium">Booking ID: {bookingData.bookingId}</div>
                        <div className="mb-2">
                            <div className="text-3xl font-semibold">{bookingData.from}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                            <div className="text-3xl font-semibold">{bookingData.to}</div>
                        </div>
                        <div className="mb-5">
                            <div style={{ gridTemplateColumns: "1fr 1fr" }} className="grid text-lg font-medium mb-1">
                                <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faCalendar} />{bookingData.pickupDate}</div>
                                <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faClock} />{bookingData.pickupTime}</div>
                            </div>
                            <div style={{ gridTemplateColumns: "1fr 1fr" }} className="grid text-lg font-medium">
                                <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faUser} />{bookingData.passenger}</div>
                                <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faBriefcase} />{bookingData.luggage}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5">
                    <div className="mb-10">
                        <div style={{ aspectRatio: "7 / 5" }} className="bg-gray-500 rounded-md w-full text-white grid place-items-center mb-3">Map</div>
                        <div>
                            <div className="text-lg font-medium mb-1">{bookingData.from} to {bookingData.to}</div>
                            <div>Distance: {distance}</div>
                            <div>Travel time: {travelTime}</div>
                        </div>
                    </div>
                    <div className="mb-10">
                        <div className="text-xl font-semibold mb-3">
                            <FontAwesomeIcon className="text-blue-900 mr-2" icon={faCalendarCheck} />
                            Your current Jobs
                        </div>
                        <div>
                            {currentJobs.map((job, index) => {
                                return (
                                    <div key={index} className="mb-3">
                                        <div className="font-semibold">{job.pickupDate}, {job.pickupTIme}</div>
                                        <div>{job.from} <FontAwesomeIcon className="text-blue-900 mx-1" icon={faArrowRight} /> {job.to}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div onClick={() => setApplyProcess("confirmation")} className="cursor-pointer bg-blue-900 rounded-md text-white font-medium text-lg w-full py-2 grid place-items-center mb-10">Apply Now</div>
                </div>
                <div className={"fixed top-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-40 w-full h-screen transition " + (applyProcess ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    {applyProcess === "confirmation" && 
                        <div>
                            <div className="bg-white w-10/12 mx-auto rounded-t-md py-6 px-5">
                                <div className="text-xl font-semibold mb-3">Confirmation</div>
                                <div>
                                    Please confirm that you are willing to apply for this job and you will take responsibility for this job.
                                </div>
                            </div>
                            <div className="bg-gray-100 w-10/12 flex items-center justify-end mx-auto rounded-b-md py-3 px-5">
                                <div onClick={() => setApplyProcess("")} className="cursor-pointer text-gray-500 border border-gray-500 rounded-md py-1 px-4 mr-3">Cancel</div>
                                <div onClick={() => setApplyProcess("offering")} className="cursor-pointer text-white border border-blue-900 bg-blue-900 rounded-md py-1 px-4">Confirm</div>
                            </div>
                        </div>
                    }
                    {applyProcess === "offering" && 
                        <div>
                            <div className="bg-white w-10/12 mx-auto rounded-t-md py-6 px-5">
                                <div className="text-xl font-semibold mb-3">Offering</div>
                                <div>
                                    Please confirm that you are willing to apply for this job and you will take responsibility for this job.
                                </div>
                            </div>
                            <div className="bg-gray-100 w-10/12 flex items-center justify-end mx-auto rounded-b-md py-3 px-5">
                                <div onClick={() => setApplyProcess("")} className="text-gray-500 border border-gray-500 rounded-md py-1 px-4 mr-3">Cancel</div>
                                <div onClick={() => setApplyProcess("offering")} className="text-white border border-blue-900 bg-blue-900 rounded-md py-1 px-4">Confirm</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default JobPage