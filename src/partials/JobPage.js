import { faArrowDown, faArrowLeft, faArrowRight, faBriefcase, faCalendar, faCalendarCheck, faClock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import NumberInput from "../components/Numberinput"
import { useForm } from "react-hook-form";
import Textinput from "../components/Textinput";
import { driverRegisterToBooking } from "../apis/backend";
import moment from "moment";
import Textareainput from "../components/Textareainput";
import he from "he"
import { translations } from "../apis/google";

const JobPage = ({ bookingData, currentJobs, isOpen, onClick, userId, setJobOpen, liff }) => {
    const [applyProcess, setApplyProcess] = useState("")
    const [total, setTotal] = useState(0)
    const [extraCount, setExtraCount] = useState(1)
    const [prices, setPrices] = useState([0, 0, [0]])
    const [loading, setLoading] = useState(false)

    const { register, setValue, handleSubmit, unregister } = useForm()

    const dateArray = isOpen && (bookingData.bookingInfo.start?.pickupDate.split("/").reverse() || bookingData.bookingInfo.pickupDate.split("/").reverse())
    const pickupDate = isOpen && moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM")

    useEffect(() => {
        unregister("")
        setPrices([0, 0, [0]])
        setExtraCount(1)
        setTotal(0)
        const JobBoard = document.querySelector('#job')
        if (!isOpen) return enableBodyScroll(JobBoard)
        setApplyProcess("")
    }, [isOpen])

    useEffect(() => {
        let extraTotalPrices = 0
        for (let i = 0; i < prices[2].length; i++) {
            extraTotalPrices += prices[2][i] >= 0 ? prices[2][i] : 0;
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
        data.bookingId = bookingData.bookingId
        data.driverId = userId
        if (data.message.th) {
            const translated = await translations(data.message.th, "en")
            data.message.en = he.decode(translated.data.data.translations[0].translatedText)
        }
        const res = await driverRegisterToBooking(data)
        alert(res.data)
        liff.closeWindow()
    }

    return (
        <div style={{ transitionTimingFunction: "cubic-bezier(.3,.18,.34,1)", transitionDuration: "350ms", overflowY: "scroll" }} className={"fixed bg-white h-screen w-full top-0 transition " + (!isOpen && "translate-x-full")}>
            {isOpen && <div className="relative">
                <div style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)" }} onClick={onClick || null} className="text-xl border-b border-gray-400 py-5 px-5">
                    <FontAwesomeIcon className="text-blue-900 mr-4" icon={faArrowLeft} />
                    บอร์ดงาน
                </div>
                <div className="">
                    <div className="px-5 pt-5 bg-white pb-3">
                        <div className="mb-2">
                            <div className="text-xl font-semibold">{bookingData.bookingInfo.start?.place.name || bookingData.bookingInfo.from.name}</div>
                            <div><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                            {bookingData.bookingType === "R&H" && bookingData.bookingInfo.visit.length && (
                                <div>
                                    <div>
                                        {bookingData.bookingInfo.visit.map((place, index) => {
                                            return (
                                                <div className="flex items-start">
                                                    <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 mt-1 rounded-full border-yellow-600 font-bold mr-2">
                                                        {/* {index !== 0 && <div className="absolute bottom-full h-5 left-1/2 -translate-x-1/2 w-1 bg-yellow-600"></div>} */}
                                                    </div>
                                                    {place.place.name}
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
                            <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 " + ((bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "bg-red-600" : "bg-green-700")}>
                                {(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") ? "ASAP" : pickupDate}
                            </div>
                            {!(bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP") && <div className={"mb-2 py-1 px-2 font-medium text-sm text-white rounded-md mr-2 bg-green-700"}>{bookingData.bookingInfo.start?.pickupTime || bookingData.bookingInfo.pickupTime}</div>}
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.adult}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-900 text-white rounded-md mr-2"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faUser} />{bookingData.bookingInfo.passenger.child}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md mr-2"><FontAwesomeIcon className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.big}</div>
                            <div className="mb-2 py-1 px-2 font-medium text-sm bg-blue-800 bg-opacity-80 text-white rounded-md"><FontAwesomeIcon style={{ fontSize: "0.7rem" }} className="text-white mr-1" icon={faBriefcase} />{bookingData.bookingInfo.luggage.medium}</div>
                        </div>
                        {bookingData.bookingInfo.message.th && <div className="mt-1 font-semibold text-lg text-yellow-600">ผู้โดยสาร: "{bookingData.bookingInfo.message.th}"</div>}
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
                    {applyProcess === "offering" ? 
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white mb-10">
                            <div className="text-lg font-semibold mb-2">เสนอราคา</div>
                            <NumberInput onChange={(value) => setPrices([parseInt(value), prices[1], prices[2]])} register={register("course", { required: "" })} required setValue={setValue} title="ราคารวมทั้งหมด" />
                            <div className="mt-2 text-sm text-red-500">*ราคารวม: น้ำมัน, ทางด่วน, คำขอเพิ่มเติมของลูกค้า, โชว์ป้าย(สนามบิน), และอื่นๆ</div>
                            <div className="my-4"></div>
                            {/* <NumberInput onChange={(value) => setPrices([prices[0], parseInt(value), prices[2]])} register={register("tollway", { required: "" })} required setValue={setValue} title="ค่าทางด่วน" />
                            <div className="flex mb-2 mt-5 ">
                                <div className="text-lg font-semibold mr-3">ราคาอื่นๆ</div>
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
                                            <Textinput onChange={() => {}} register={register(`extra.[${index}].title`)} setValue={setValue} title="หัวข้อ" />
                                            <NumberInput onChange={pricesHandle} register={register(`extra.[${index}].price`)} setValue={setValue} title="ราคา" />
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="mt-2 mb-4 font-medium text-lg">รวม: {total}</div> */}
                            {bookingData.bookingInfo.start?.pickupTime === "ASAP" || bookingData.bookingInfo.pickupTime === "ASAP" && <div className="mb-3"><NumberInput onChange={() => {}} register={register("arrival", { required: "" })} required setValue={setValue} title="นาทีที่คุณจะถึงที่นัดหมาย" /></div>}
                            <Textareainput onChange={() => {}} register={register("message.th")} setValue={setValue} title="ข้อความถึงผู้โดยสาร" />
                            <div className="mt-2 text-sm text-red-500">*สำหรับหัวหน้า: โปรดเขียนประเภทรถที่ให้บริการ(Economy, Sedan, Family, Van, VIP Van)</div>
                            <div className="mb-9"></div>
                            <button type="submit" className={"cursor-pointer bg-blue-900 rounded-lg text-white font-medium text-lg w-full py-2 grid place-items-center " + (loading && "pointer-events-none opacity-80")}>{loading ? "Loading..." : "Send"}</button>
                        </form>
                        :
                        <div className="mb-10">
                            <div className="text-xl font-semibold mb-3">
                                <FontAwesomeIcon className="text-blue-900 mr-2" icon={faCalendarCheck} />
                                งานปัจจุบันของคุณ
                            </div>
                            <div>
                                {[...Array(3)].map((count, index) => {
                                    return (
                                        <div key={index} className="px-3 py-3 bg-blue-50 rounded-md mb-3">
                                            <div className="font-semibold text-lg mb-2">{moment(new Date().getTime() + (24 * 60 * 60 * 1000 * index)).format("DD MMM")}</div>
                                            {/* {currentJobs.length > 0 ? currentJobs.map((job, index) => {
                                                console.log(job)
                                                return (
                                                    <div key={index} className="mb-2 px-3 py-2 rounded-md bg-blue-100">
                                                        <div className="font-medium">{job.pickupTime}</div>
                                                        <div>{job.start?.place.name || job.from.name}</div>
                                                        <div className="-my-1.5"><FontAwesomeIcon className="text-blue-900 mx-1" icon={faArrowDown} /></div>
                                                        <div>{job.end?.place.name || job.to.name}</div>
                                                    </div>
                                                )
                                            }) 
                                            : "No job on this day"} */}
                                            ยังไม่มีงานในวันที่นี้
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                    {applyProcess !== "offering" && <div onClick={() => setApplyProcess("offering")} className="cursor-pointer bg-blue-900 rounded-md text-white font-medium text-lg w-full py-2 grid place-items-center mb-10">เสนอราคาเลย</div>}
                </div>
                {applyProcess !== "offering" && <ApplicationConfirmation applyProcess={applyProcess} setApplyProcess={setApplyProcess} />}
            </div>}
        </div>
    )
}

export default JobPage

const ApplicationConfirmation = ({ applyProcess, setApplyProcess }) => {
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
        </div>
    )
}