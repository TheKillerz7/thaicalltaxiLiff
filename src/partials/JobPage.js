import { faArrowDown, faArrowLeft, faArrowRight, faBriefcase, faCalendar, faCalendarCheck, faClock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import NumberInput from "../components/Numberinput"
import { useForm } from "react-hook-form";
import Textinput from "../components/Textinput";
import { driverRegisterToBooking } from "../apis/backend";

const JobPage = ({ bookingData, currentJobs, isOpen, onClick, driverId, setJobOpen }) => {
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

    useEffect(() => {
        const JobBoard = document.querySelector('#job')
        if (!isOpen) return enableBodyScroll(JobBoard)

        const el = document.querySelector("#headJob")
        const observer = new IntersectionObserver( 
            ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
            { threshold: [1] }
        );
        observer.observe(el);

        disableBodyScroll(JobBoard)
        return () => {
            clearAllBodyScrollLocks()
            observer.disconnect()
        }
    }, [isOpen])

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
                                <div className="mr-5"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faUser} />{bookingData.passenger} people</div>
                                <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faBriefcase} />{bookingData.luggage} luggages</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5">
                    <div className="mb-10">
                        <div style={{ aspectRatio: "7 / 5" }} className="bg-gray-500 rounded-md w-full text-white grid place-items-center mb-3">
                            <iframe
                                height="250"
                                className="w-full rounded-md"
                                src={`https://www.google.com/maps/embed/v1/directions?
                                    key=AIzaSyBbjxIWcwiaWvTlPuPn9lzOMhJCEwYAhu0&
                                    origin=${bookingData.bookingInfo.start?.place?.placeId || bookingData.bookingInfo.from.placeId}&
                                    destination=${bookingData.bookingInfo.end?.place?.placeId || bookingData.bookingInfo.to.placeId}`}
                            >
                            </iframe>
                        </div>
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
                <JobApplication applyProcess={applyProcess} setJobOpen={setJobOpen} setApplyProcess={setApplyProcess} bookingData={bookingData} driverId={driverId} />
            </div>
        </div>
    )
}

export default JobPage

const JobApplication = ({ applyProcess, setApplyProcess, bookingData, driverId, setJobOpen }) => {
    const [total, setTotal] = useState(0)
    const [extraCount, setExtraCount] = useState(1)
    const [prices, setPrices] = useState([0, 0, [0]])
    const [loading, setLoading] = useState(false)

    const { register, setValue, handleSubmit, unregister } = useForm()

    useEffect(() => {
        let extraTotalPrices = 0
        for (let i = 0; i < prices[2].length; i++) {
            extraTotalPrices += prices[2][i];
        }
        setTotal(prices[0] + prices[1] + extraTotalPrices)
    }, [prices])

    const handleExtraPricesIncrementation = (isIncrement) => {
        let extraPrice = prices[2]
        if (isIncrement) {
            if (extraCount === 5) return
            setExtraCount(count => count + 1 )
            extraPrice.push(0)
            setPrices([prices[0], prices[1], [...extraPrice]])
        }
        else {
            if (extraCount === 1) return
            setExtraCount(count => count - 1)
            extraPrice.pop()
            unregister(`extra.[${extraCount - 1}]`)
            setPrices([prices[0], prices[1], [...extraPrice]])
        }
    }

    const onSubmit = async (data) => {
        setLoading(true)
        data.bookingId = bookingData.bookingId
        data.driverId = driverId || "U2330f4924d1d5faa190c556e978bee23"
        const res = await driverRegisterToBooking(data)
        setJobOpen(false)
        setApplyProcess("")
        setLoading(false)
        alert(res.data)
    }

    return (
        <div className={"fixed top-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-40 w-full h-screen transition " + (applyProcess ? "opacity-100" : "opacity-0 pointer-events-none")}>
            {applyProcess === "confirmation" && 
                <>
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
                </>
            }
            {applyProcess === "offering" && 
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-11/12 mx-auto rounded-md py-6 px-5">
                        <div className="text-lg font-semibold mb-2">Price Offer</div>
                        <NumberInput onChange={(value) => setPrices([parseInt(value), prices[1], prices[2]])} register={register("trip")} setValue={setValue} title="Trip price" />
                        <div className="my-3"></div>
                        <NumberInput onChange={(value) => setPrices([prices[0], parseInt(value), prices[2]])} register={register("tollway")} setValue={setValue} title="Toll way" />
                        <div className="flex mb-2 mt-5 ">
                            <div className="text-lg font-semibold mr-3">Extras</div>
                            <div className="flex bg-blue-900 text-white text-lg font-medium w-max text-center rounded-md">
                                <div onClick={() => handleExtraPricesIncrementation(false)} className="px-2 cursor-pointer">-</div>
                                <div onClick={() => handleExtraPricesIncrementation(true)} className="px-2 cursor-pointer">+</div>
                            </div>
                        </div>
                        {[...Array(extraCount)].map((count, index) => {
                            const pricesHandle = (value) => {
                                const temp = prices[2]
                                temp.fill(parseInt(value), index, index+1)
                                setPrices([prices[0], prices[1], [...temp]])
                            }
                    
                            return (
                                <div key={index} className="mb-3">
                                    <div className="grid grid-cols-2 gap-x-2">
                                        <Textinput onChange={() => {}} register={register(`extra.[${index}].title`)} setValue={setValue} title="Title" />
                                        <NumberInput onChange={pricesHandle} register={register(`extra.[${index}].price`)} setValue={setValue} title="Price" />
                                    </div>
                                </div>
                            )
                        })}
                        <div className="mt-7 mb-2 font-medium text-lg">Total: {total}</div>
                        <button type="submit" className={"cursor-pointer bg-blue-900 rounded-lg text-white font-medium text-lg w-full py-2 grid place-items-center " + (loading && "pointer-events-none opacity-80")}>{loading ? "Loading..." : "Confirm Offer"}</button>
                    </form>
                </>
            }
        </div>
    )
}