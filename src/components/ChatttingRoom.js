import { faArrowDown, faBook, faChevronLeft, faCircleInfo, faPaperPlane, faPencil, faPhone, faTags, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker, { TimePicker } from "sassy-datepicker";
import {io} from 'socket.io-client';
import { getBookingById, getChattingMessages, getDriverById, getRoomByRoomId, getRoomsByUserId, getSelectedRegisterByBookingId, readChatMessages, transferJob, updateBooking, updatePrice } from "../apis/backend";
import Textinput from "./Textinput";
import Timepicker from "./Timepicker";

const connectionOptions =  {
    withCredentials: true,
    transports: ['websocket']
  };

const ChattingRoom = ({ userId }) => {
    const { page, roomId, userType } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const roomIdEscaped = roomId && roomId.split("&")[0]
    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get("roomId")) {
            navigate(`/chat/${userType}/room/${searchParams.get("roomId")}`) 
        }
    }, [])

    return (
        <div>
            {page === "inbox" ?
                <RoomsPage userType={userType} userId={userId}  />
                :
                <ChatPage userType={userType} roomId={roomIdEscaped} userId={userId} />
            }
        </div>
    )
}

export default ChattingRoom

const RoomsPage = ({ userId, userType }) => {
    const [rooms, setRooms] = useState([])
    const [onload, setOnload] = useState(true)

    const getRoomsHandle = async () => {
        const res = await getRoomsByUserId(userId, userType)
        setOnload(false)
        setRooms(res.data)
        return res
    }

    useEffect(() => {
        let rooms = []
        const socket = io("https://9f3a-2405-9800-b650-586-f170-fa29-5671-f54a.ap.ngrok.io", connectionOptions)
        socket.on('connect', async () => {
            const res = await getRoomsHandle()
            if (typeof res.data !== "string" && res.data.length > 0) {
                const roomIds = typeof res.data !== "string" && res?.data?.map((room, index) => {
                    return room.roomId
                })
                rooms = [...roomIds]
                if (roomIds?.length) socket.emit("join", [...roomIds])
            }
        });
        socket.on('message', (message) => {
            console.log(message)
            getRoomsHandle()
        });
        socket.on('disconnect', () => {

        });
        return () => {
            socket.emit("leave", [...rooms]);
            socket.off('message');
            socket.off('connect');
            socket.off('disconnect');
          };
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center pt-12 pb-5 px-5 bg-gray-100">
                <div className="text-3xl font-semibold">Chats</div>
            </div>
            <div className="w-full py-4">
                {onload ? 
                    <div role="status" className="flex justify-center mt-5">
                        <svg aria-hidden="true" className="mr-2 w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                        </svg>
                    </div>
                    : typeof rooms !== "string" && rooms.length > 0 ?
                        rooms.map((room, index) => {
                            var now = moment(new Date()); //todays date
                            var end = moment(room.messages.latestMessage?.createdDate || room.createdDate); // another date
                            var duration = moment.duration(now.diff(end));
                            var days = duration.asDays() <= 1 ? duration.asMinutes() <= 30 ? duration.humanize().includes("minutes") ? duration.humanize().replace("minutes", "mins") : duration.humanize().replace("minute", "mins") : end.format("HH.mm") : duration.asDays() >= 2 ? end.format("DD/MM/yyyy") : "yesterday";
                            const messages = room.messages

                            return (
                                <Link key={index} to={`/chat/${userType}/room/${room.roomId}`}>
                                    <div className="focus:bg-blue-100 flex justify-between px-5 py-4">
                                        <div className="flex w-full overflow-hidden">
                                            <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                                            <div className="overflow-hidden">
                                                <div className="font-medium">{room.pickupTime === "ASAP" ? room.pickupDate : room.pickupTime + ", " + room.pickupDate}</div>
                                                <div className="flex">
                                                    {!messages.unreadMessages.length > 0 && <div style={{ maxWidth: "15ch" }} className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">{messages?.latestMessage?.message}</div>}
                                                    {messages.unreadMessages.length > 0 && <div style={{ maxWidth: "15ch" }} className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">{messages.unreadMessages.length > 1 ? messages.unreadMessages.length + " new messages" : messages.unreadMessages[0].message}</div>}
                                                    {!messages.latestMessage && <div className="text-gray-500">No message yet.</div>}
                                                    <div className="text-right w-max font-medium text-sm text-gray-400 pt-0.5 ml-3">{days}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                        :
                        <div className="px-5 text-center text-lg font-medium pt-10">Sorry there's no chat rooms yet.</div>
                }
            </div>
        </div>
    )
}

let socket
const ChatPage = ({ roomId, userType, userId }) => {
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([])
    const [bookingData, setBookingData] = useState({})
    const [driver, setDriver] = useState([])
    const [meetingService, setMeetingService] = useState(null)
    const [prices, setPrices] = useState({})
    const [onTransfer, setOnTransfer] = useState(false)
    const [onCheckBookingInfo, setOnCheckBookingInfo] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [onload, setOnload] = useState(true)
    const navigate = useNavigate()
    
    const input = useRef()

    useEffect(() => {
        socket = io("https://9f3a-2405-9800-b650-586-f170-fa29-5671-f54a.ap.ngrok.io", connectionOptions)
        let messageStorage = []
        const getMessage = async () => {
            const room = (await getRoomByRoomId(roomId)).data[0]
            if (!room) return navigate(`/chat/${userType}/inbox`)
            const booking = (await getBookingById(room.bookingId)).data[0]
            setMeetingService(booking.meetingService)
            const prices = (await getSelectedRegisterByBookingId(booking.bookingId)).data[0]
            prices.extra = JSON.parse(prices.extra)
            setPrices(prices)
            const driver = (await getDriverById(prices.driverId)).data
            driver[0].vehicleInfo = JSON.parse(driver[0].vehicleInfo)
            setDriver(driver)
            booking.bookingInfo = JSON.parse(booking.bookingInfo)
            let startingDate = []
            let pickupDateStart = ""
            if (booking.bookingInfo.start?.pickupDate === "ASAP" || booking.bookingInfo.pickupDate === "ASAP") {
                setRoomName(`ASAP`)
            } else {
                startingDate = booking.bookingInfo.start?.pickupDate.split("/").reverse() || booking.bookingInfo.pickupDate.split("/").reverse()
                pickupDateStart = moment(new Date(startingDate[0], (parseInt(startingDate[1]) - 1).toString(), startingDate[2])).format("DD MMM")
                setRoomName(`${booking.bookingInfo.start?.pickupTime || booking.bookingInfo.pickupTime}, ${pickupDateStart}`)
            }
            setBookingData(booking)
            await readChatMessages(roomId, userType)
            const messages = await getChattingMessages(roomId)
            setOnload(false)
            messageStorage = [...messages.data.reverse()]
            setMessages([...messageStorage])
        }
        getMessage()
        socket.on('connect', async () => {
            console.log('connect')
            if (roomId) socket.emit("join", roomId)
        });
        socket.on('message', (message) => {
            messageStorage.push(message)
            setMessages([...messageStorage])
        });
        socket.on('disconnect', () => {

        });
        return () => {
            socket.disconnect()
            socket.off('message')
            socket.off('connect');
            socket.off('disconnect');
          };
    }, [])

    const sendMessageHandle = () => {
        if (inputValue.replace(/\s/g, '') == "") return
        input.current.value = ""
        setInputValue("")
        socket.emit('message', {
            bookingId: bookingData.bookingId,
            roomId,
            inputValue,
            userType,
            userId
        })
    }

    useEffect(() => {
        document.querySelector('html').scrollIntoView({ block: "end" });
    }, [messages])

    return (
        <div className="h-full">
            <div style={{  }} className="py-4 px-5 flex items-center justify-between bg-blue-50 mb-5 sticky top-0">
                <div className="flex items-center w-10/12 overflow-hidden">
                    <Link to={`/chat/${userType}/inbox`}><div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div></Link>
                    <div className="items-center flex overflow-hidden">
                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-10 mr-4"></div>
                        <div className="overflow-hidden pr-1">
                            <div className="font-medium text-lg text-ellipsis whitespace-nowrap overflow-hidden">{roomName}</div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end w-2/12">
                    <div onClick={() => setOnCheckBookingInfo(current => !current)} className="grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-blue-900 text-2xl" icon={faCircleInfo} /></div>
                </div>
            </div>
            <div className="pb-24 px-3">
                {onload ? 
                    <div role="status" className="flex justify-center mt-5">
                        <svg aria-hidden="true" className="mr-2 w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                        </svg>
                    </div>
                    :
                    <div>
                        {userType === "user" && <div className="border border-gray-500 px-5 py-4 rounded-md bg-gray-50 mb-5 w-10/12 mx-auto"><span className="font-semibold">Driver may provide:</span><br/>1. Same car type as you chosse<br/>2. Similar car type<br/>3. Bigger car type</div>}
                        {messages.map((message, index) => {
                            let messageSide = message.senderType === userType ? "right" : "left"

                            const MessageComponent = () => {
                                switch (message.messageType) {
                                    case "greeting":
                                        return(
                                            <div className="break-normal font-medium">
                                                {messageSide === "left" && <div className="mb-1">{message.translated}</div>}
                                                <div className={messageSide === "left" ? "text-white font-light" : ""}>{message.message}</div>
                                            </div>
                                        )

                                    case "text":
                                        if (message.message.includes("://")) {
                                            return (
                                                <div className="break-normal font-medium">
                                                    {messageSide === "left" &&
                                                        <div className="mb-1">
                                                            {message.translated.split(" ").length ? 
                                                                message.translated.split(" ").map((text, index) => {
                                                                    return text.includes("://") ? 
                                                                        <div onClick={() => window.location.replace(text)} className={"underline inline mr-1.5" + (messageSide === "left" ? "text-blue-100" : "text-blue-500")}>{text}</div>
                                                                        :
                                                                        text + " "
                                                                })
                                                                :
                                                                <div onClick={() => window.location.replace(message.translated)} className={"underline inline mr-1.5 " + (messageSide === "left" ? "text-blue-100" : "text-blue-500")}>{message.translated}</div>
                                                            }
                                                        </div>
                                                    }
                                                    <div className={messageSide === "left" ? "text-white font-light" : ""}>
                                                        {message.message.split(" ").length ? 
                                                            message.message.split(" ").map((text, index) => {
                                                                return text.includes("://") ? 
                                                                    <div onClick={() => window.location.replace(text)} className={"underline inline mr-1.5 " + (messageSide === "left" ? "text-blue-100" : "text-blue-500")}>{text}</div>
                                                                    :
                                                                    text + " "
                                                            })
                                                            :
                                                            <div onClick={() => window.location.replace(message.message)} className={"underline inline mr-1.5 " + (messageSide === "left" ? "text-blue-100" : "text-blue-500")}>{message.message}</div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                            
                                        }
                                        return (
                                            <div className="break-normal font-medium">
                                                {messageSide === "left" && <div className="mb-1">{message.translated}</div>}
                                                <div className={messageSide === "left" ? "text-white font-light" : ""}>{message.message}</div>
                                            </div>
                                        )
                                
                                    default:
                                        return ""
                                }
                            }
                            
                            return (
                                <div key={index}>
                                    <div className={"flex mb-5 " + (messageSide === "right" ? "justify-end" : "justify-start")}>
                                        {messageSide === "left" && <div className="w-8 mr-3"><div className="bg-blue-900 text-white grid place-items-center rounded-full w-8 h-8"><FontAwesomeIcon icon={faUser} /></div></div>}
                                        <div className={"max-w-xs px-3 py-2 rounded-md " + (messageSide === "left" ? "bg-blue-900 text-white" : "bg-gray-100")}>
                                            <MessageComponent />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            <div className="py-5 px-3 fixed bottom-0 w-full bg-white">
                <div className="bg-gray-200 rounded-full py-2 w-full flex justify-between items-center">
                    <div className="px-5 w-full"><input ref={input} onChange={(e) => setInputValue(e.target.value)} placeholder="Type here..." className="bg-transparent font-medium text-lg w-full outline-none" /></div>
                    <div className="flex items-center w-max pr-3">
                        {/* <div><FontAwesomeIcon className="text-2xl rotate-45 mr-3 cursor-pointer" icon={faPaperclip} /></div> */}
                        <div onClick={sendMessageHandle} style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full w-9 grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-white" icon={faPaperPlane} /></div>
                    </div>
                </div>
            </div>
            {bookingData.bookingInfo && (
                <>
                    <BookingDetail driver={driver} prices={prices} onCheckBookingInfo={onCheckBookingInfo} setOnTransfer={setOnTransfer} setOnCheckBookingInfo={setOnCheckBookingInfo} bookingData={bookingData} userType={userType} />
                    <TransferJob userId={userId} bookingData={bookingData} onTransfer={onTransfer} setOnTransfer={setOnTransfer} />
                </>
            )}
        </div>
    )
}

const BookingDetail = ({ onCheckBookingInfo, setOnCheckBookingInfo, bookingData, userType, setOnTransfer, driver, prices }) => {
    const [onEdit, setOnEdit] = useState([false, false])
    const [price, setPrice] = useState({})
    const [iniPrice, setIniPrice] = useState([])
    const [area, setArea] = useState({})
    const [datePicker, setDatePicker] = useState("")
    const [dateValue, setDateValue] = useState(new Date())
    const [total, setTotal] = useState(0)
    const [boolean, setBoolean] = useState(false)
    const [increment, setIncrement] = useState(10000)
    const [increment1, setIncrement1] = useState(10000)
    const [submitType, setSubmitType] = useState("")
    
    const dateArray = (bookingData?.bookingInfo.start?.pickupDate.split("/").reverse() || bookingData.bookingInfo.pickupDate.split("/").reverse())
    const pickupDate = moment(new Date(dateArray[0], (parseInt(dateArray[1]) - 1).toString(), dateArray[2])).format("DD MMM YYYY")
    const dateArrayEnd = (bookingData?.bookingInfo.end?.pickupDate.split("/").reverse())
    const pickupDateEnd = dateArrayEnd && moment(new Date(dateArrayEnd[0], (parseInt(dateArrayEnd[1]) - 1).toString(), dateArrayEnd[2])).format("DD MMM YYYY")
    console.log(area)
    const { register, setValue, handleSubmit, reset, unregister, getValues } = useForm({defaultValues: {
        bookingInfo: bookingData.bookingInfo
    }})

    useEffect(() => {
        if (iniPrice.extra?.length) {
            reset({
                extra: {
                    course: iniPrice.course,
                    tollway: iniPrice.tollway,
                    extra: [...iniPrice.extra]
                }
            })
        }
    }, [onEdit[1]])

    useEffect(() => {
        reset({
            bookingInfo: bookingData.bookingInfo
        })
        setValue("bookingInfo.carType", driver[0]?.vehicleInfo.carType)
    }, [onEdit[0]])

    useEffect(() => {
        if (bookingData.bookingType === "R&H") {
            const areaTemp = {}
            bookingData.bookingInfo.visit.forEach((visit, index) => {
                areaTemp[index] = visit.place.name
            })
            setArea({...areaTemp})
        }
        const callback = async () => {
            setValue("bookingInfo.carType", driver[0].vehicleInfo.carType)
            const priceObj = {}
            let totalPrice = 0
            if (prices.extra.length) {
                prices.extra.forEach((extra, index) => {
                    if (extra.title) priceObj[extra.title] = parseInt(extra.price)
                })
                
                Object.keys(priceObj).forEach((item, index) => {
                    totalPrice += priceObj[item]
                })
            }
            totalPrice += parseInt(prices.course)
            totalPrice += parseInt(prices.tollway)
            setTotal(totalPrice)
            setPrice({...priceObj})
            setValue("extra", {
                course: prices.course,
                tollway: prices.tollway,
                extra: (prices.extra.length && prices.extra)
            })
            setIniPrice({
                course: prices.course,
                tollway: prices.tollway,
                extra: (prices.extra.length && prices.extra)
            })
        }
        callback()
    }, [])

    useEffect(() => {
        const timeString = moment(dateValue).format("DD/MM/YYYY")
        setValue("bookingInfo." + datePicker, timeString)
        setBoolean(!boolean)
        if (boolean) setDatePicker("")
    }, [dateValue])

    const onDatepickHandle = (e) => {    
        setDateValue(e)
    }

    const addAreaHandle = (id, type, index) => {
        const temp = area
        if (type === "add") {
            temp[increment1 + 1] = ""
            setArea(temp)
            setIncrement1(curr => curr + 1)
            return
        }
        unregister(`bookingInfo.visit`)
        delete temp[id]
        setArea(temp)
        setIncrement1(curr => curr + 1)
    }

    const addExtraHandle = (id, type, index) => {
        const temp = price
        if (type === "add") {
            temp[increment + 1] = 0
            setPrice(temp)
            setIncrement(curr => curr + 1)
            return
        }
        unregister(`extra`)
        delete temp[id]
        setPrice(temp)
        setIncrement(curr => curr + 1)
    }

    const submitHandle = async (data) => {
        console.log(data)
        try {
            if (submitType === "bookingInfo") {
                data.bookingInfo = JSON.stringify(data.bookingInfo)
                await updateBooking(bookingData.bookingId, {bookingInfo: data.bookingInfo})
            } else {
                if (data.extra.extra) {
                    data.extra.extra = JSON.stringify(data.extra.extra)
                } else {
                    data.extra.extra = "{}"
                }
                await updatePrice(bookingData.bookingId, data.extra)
            }
            alert("Success")
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div onClick={(e) => {
                if (typeof e.target.className === "string") {
                    !e.target.className?.includes("sdp") && setDatePicker("")
                }
            }} style={{ zIndex: "10" }} className={'fixed h-screen w-screen transition bg-black top-0 bg-opacity-30 left-0 grid place-items-center ' + (datePicker !== "" ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <div className='w-10/12 grid place-items-center'>
                    {dateValue && <DatePicker
                        minDate={new Date()}
                        value={dateValue}
                        onChange={onDatepickHandle}
                        className="w-full"
                        style={{ paddingBottom: "20px" }}
                    />}
                </div>
            </div>
            <div className={"h-screen w-full fixed top-0 left-0 bg-white transition overflow-y-scroll overflow-x-hidden duration-300 " + (onCheckBookingInfo ? "translate-x-0" : "translate-x-full")}>
                <div className="">
                    <div onClick={() => setOnCheckBookingInfo(current => !current)} style={{ boxShadow: "5px 0px 10px 4px rgba(0, 0, 0, 0.15)" }} className="flex px-4 py-4">
                        <div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div>
                        <div className="font-semibold text-lg">Detail</div>
                    </div>
                    <div>
                        <div>
                            <div className="px-5 pt-5 bg-white pb-3">
                                <div className="">
                                    {prices?.newMessage && <div className="font-semibold text-xl mb-5">Message: <span className="text-yellow-600">"{prices.newMessage}"</span></div>}
                                    <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faBook} /></span>Booking Info</div>
                                    <form onSubmit={handleSubmit(submitHandle)} className="bg-blue-50 rounded-lg py-4 px-4 mb-5 relative">
                                        {!onEdit[0] && userType === "driver" && <div onClick={() => setOnEdit([true, onEdit[1]])} style={{ aspectRatio: "1" }} className="rounded-md cursor-pointer w-min grid place-items-center bg-orange-600 p-2 absolute right-3"><FontAwesomeIcon className="text-white text-sm" icon={faPencil} /></div>}
                                        {bookingData.bookingType === "R&H" ?
                                        <div className="">
                                            <div>
                                                <div>
                                                    {!onEdit[0] ?
                                                        <div className="font-semibold w-10/12">{bookingData.bookingInfo.start.place.name}</div>
                                                        :
                                                        <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                            <input {...register("bookingInfo.start.place.name")}  placeholder="" type="text" className="outline-none w-full" />
                                                        </div>
                                                    }
                                                    <div className="-mt-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                                    {increment1 && Object.keys(area).map((place, index) => {
                                                        return (
                                                            <div key={place} className="flex items-start">
                                                                <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 mt-1 rounded-full border-yellow-600 font-bold mr-2">
                                                                </div>
                                                                {!onEdit[0] ?
                                                                    <div className="">{area[place]}</div>
                                                                    :
                                                                    <div className="flex items-center w-full">
                                                                        <div className='bg-white w-full my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                            <input {...register(`bookingInfo.visit.[${index}].place.name`)} placeholder="" type="text" className="outline-none w-full" />
                                                                        </div>
                                                                        {Object.keys(area)?.length !== 1 && <div onClick={() => addAreaHandle(place, "remove", index)} style={{ aspectRatio: "1" }} className="bg-blue-900 h-7 rounded-md grid ml-2 place-items-center cursor-pointer"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>}
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                    {onEdit[0] && 
                                                        <div className="ml-6 flex bg-blue-900 text-white text-lg font-medium w-max text-center rounded-md mb-3 mt-1">
                                                            <div onClick={() => addAreaHandle("", "add")} className="px-3 cursor-pointer text-sm py-1">+ Add</div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="-mb-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                            </div>
                                            {!onEdit[0] ?
                                                <div className="font-semibold mb-3">{bookingData.bookingInfo.end.place.name}</div>
                                                :
                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                    <input {...register("bookingInfo.end.place.name")} placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                            <table className="">
                                                <tbody>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Course</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2 w-full">
                                                            <div className="">Rent & Hire</div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Type</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                bookingData.bookingInfo.type
                                                                :
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <select className="w-full outline-none bg-white" {...register("bookingInfo.type")}>
                                                                        <option value="Sightseeing">Sightseeing</option>
                                                                        <option value="Shopping">Shopping</option>
                                                                        <option value="Business">Business</option>
                                                                        <option value="Others">Others</option>
                                                                    </select>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Starting</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                bookingData.bookingInfo.start.pickupTime === "ASAP" ? "ASAP" : bookingData.bookingInfo.start.pickupTime + ", " + pickupDate
                                                                :
                                                                <div className="grid gap-x-2 grid-cols-2">
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <Timepicker chatroom register={register("bookingInfo.pickupTime")} title="Time" setValue={setValue} prefill={bookingData.bookingInfo.start.pickupTime} />
                                                                        <input {...register("bookingInfo.start.pickupTime")} placeholder="" type="text" className="outline-none w-full" hidden />
                                                                    </div>
                                                                    <div onClick={() => {
                                                                        let date = getValues("bookingInfo.start.pickupDate")
                                                                        if (date !== "ASAP") {
                                                                            date = date.split('/').reverse()
                                                                            setDateValue(new Date(date[0], (parseInt(date[1]) - 1).toString() , date[2]))
                                                                        }
                                                                        setDatePicker("start.pickupDate")
                                                                    }} className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.start.pickupDate")} placeholder="" type="text" className="outline-none w-full" disabled />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Ending</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                bookingData.bookingInfo.end.pickupTime + ", " + pickupDateEnd
                                                                :
                                                                <div className="grid gap-x-2 grid-cols-2">
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <Timepicker chatroom register={register("bookingInfo.pickupTime")} title="Time" setValue={setValue} prefill={bookingData.bookingInfo.end.pickupTime} />
                                                                        <input {...register("bookingInfo.end.pickupTime")} placeholder="" type="text" className="outline-none w-full" hidden />
                                                                    </div>
                                                                    <div onClick={() => {
                                                                        let date = getValues("bookingInfo.end.pickupDate")
                                                                        if (date !== "ASAP") {
                                                                            date = date.split('/').reverse()
                                                                            setDateValue(new Date(date[0], (parseInt(date[1]) - 1).toString() , date[2]))
                                                                        }
                                                                        setDatePicker("end.pickupDate")
                                                                    }} className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.end.pickupDate")} placeholder="" type="text" className="outline-none w-full" disabled />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Car Type</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                driver[0]?.vehicleInfo.carType
                                                                :
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <select className="w-full outline-none bg-white" {...register("bookingInfo.carType")}>
                                                                        <option value="Economy type">Economy type</option>
                                                                        <option value="Sedan type">Sedan type</option>
                                                                        <option value="Family type">Family type</option>
                                                                        <option value="Van type">Van type</option>
                                                                    </select>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Passenger</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                `${bookingData.bookingInfo.passenger.adult} adults, ${bookingData.bookingInfo.passenger.child} children`
                                                                :
                                                                <div className="grid gap-x-2 grid-cols-2">
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.passenger.adult")} placeholder="Adult" type="number" className="outline-none w-full" />
                                                                    </div>
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.passenger.child")} placeholder="Child" type="number" className="outline-none w-full" />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Luggage</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                `${bookingData.bookingInfo.luggage.big} big, ${bookingData.bookingInfo.luggage.medium} medium`
                                                                :
                                                                <div className="grid gap-x-2 grid-cols-2">
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.luggage.big")} placeholder="Big" type="number" className="outline-none w-full" />
                                                                    </div>
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.luggage.medium")} placeholder="Med" type="number" className="outline-none w-full" />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle whitespace-nowrap font-medium">Message</td>
                                                        {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                        <td className="align-middle pl-2">
                                                            {!onEdit[0] ?
                                                                bookingData.bookingInfo.message.en
                                                                :
                                                                <div className="">
                                                                    <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                        <input {...register("bookingInfo.message.en")} placeholder="Big" type="text" className="outline-none w-full" />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <div className="">
                                            {!onEdit[0] ?
                                                <div className="font-semibold w-10/12">{bookingData.bookingInfo.from.name}</div>
                                                :
                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                    <input {...register("bookingInfo.from.name")} placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                            <div className="-my-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                            {!onEdit[0] ?
                                                <div className="font-semibold mb-3">{bookingData.bookingInfo.to.name}</div>
                                                :
                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                    <input {...register("bookingInfo.to.name")} placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                            <table className="">
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">Course</td>
                                                    {onEdit[0] && <td className="text-xl pl-2 pb-1 align-middle">:</td>}
                                                    <td className="align-middle pl-2">
                                                        A to B Course
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">Time</td>
                                                    {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                    <td className="align-middle pl-2">
                                                        {!onEdit[0] ?
                                                            bookingData.bookingInfo.pickupTime === "ASAP" ? "ASAP" : bookingData.bookingInfo.pickupTime + ", " + pickupDate
                                                            :
                                                            <div className="grid gap-x-2 grid-cols-2">
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <Timepicker chatroom register={register("bookingInfo.pickupTime")} title="Time" setValue={setValue} prefill={bookingData.bookingInfo.pickupTime} />
                                                                    <input {...register("bookingInfo.pickupTime")} placeholder="" type="text" className="outline-none w-full" hidden />
                                                                </div>
                                                                <div onClick={() => {
                                                                    let date = getValues("bookingInfo.pickupDate")
                                                                    if (date !== "ASAP") {
                                                                        date = date.split('/').reverse()
                                                                        setDateValue(new Date(date[0], (parseInt(date[1]) - 1).toString() , date[2]))
                                                                    }
                                                                    setDatePicker("pickupDate")
                                                                }} className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <input {...register("bookingInfo.pickupDate")} placeholder="" type="text" className="outline-none w-full" disabled />
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">Car Type</td>
                                                    {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                    <td className="align-middle pl-2">
                                                        {!onEdit[0] ?
                                                            driver[0]?.vehicleInfo.carType
                                                            :
                                                            <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                <select className="w-full outline-none bg-white" {...register("bookingInfo.carType")}>
                                                                    <option value="Economy type">Economy type</option>
                                                                    <option value="Sedan type">Sedan type</option>
                                                                    <option value="Family type">Family type</option>
                                                                    <option value="Van type">Van type</option>
                                                                </select>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">Passenger</td>
                                                    {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                    <td className="align-middle pl-2">
                                                        {!onEdit[0] ?
                                                            `${bookingData.bookingInfo.passenger.adult} adults, ${bookingData.bookingInfo.passenger.child} children`
                                                            :
                                                            <div className="grid gap-x-2 grid-cols-2">
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <input {...register("bookingInfo.passenger.adult")} placeholder="Adult" type="number" className="outline-none w-full" />
                                                                </div>
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <input {...register("bookingInfo.passenger.child")} placeholder="Child" type="number" className="outline-none w-full" />
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle whitespace-nowrap font-medium">Luggage</td>
                                                    {onEdit[0] && <td className="text-xl pl-2 align-middle">:</td>}
                                                    <td className="align-middle pl-2">
                                                        {!onEdit[0] ?
                                                            `${bookingData.bookingInfo.luggage.big} big, ${bookingData.bookingInfo.luggage.medium} medium`
                                                            :
                                                            <div className="grid gap-x-2 grid-cols-2">
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <input {...register("bookingInfo.luggage.big")} placeholder="Big" type="number" className="outline-none w-full" />
                                                                </div>
                                                                <div className='bg-white my-1 px-2 text-sm py-1 transition-all rounded-md border border-gray-400'>
                                                                    <input {...register("bookingInfo.luggage.medium")} placeholder="Med" type="number" className="outline-none w-full" />
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        }
                                        {onEdit[0] &&
                                            <div className="grid grid-cols-2 gap-x-3 mt-3">
                                                <div onClick={() => {
                                                    if (bookingData.bookingType === "R&H") {
                                                        const areaTemp = {}
                                                        bookingData.bookingInfo.visit.forEach((visit, index) => {
                                                            areaTemp[index] = visit.place.name
                                                        })
                                                        setArea({...areaTemp})
                                                    }
                                                    setOnEdit([false, onEdit[1]])
                                                }} className="bg-gray-200 cursor-pointer rounded-md py-2 text-center text-sm font-medium">Cancel</div>
                                                <button onClick={() => setSubmitType("bookingInfo")} type="submit" className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium text-sm">Submit</button>
                                            </div>
                                        }
                                    </form>
                                    <div>
                                        <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faTags} /></span>Selected Price</div>
                                        <div className="bg-blue-50 rounded-lg relative">
                                            <form onSubmit={handleSubmit(submitHandle)} className="border-b-2 border-gray-400 h-full w-full border-dashed py-4 px-4">
                                                {!onEdit[1] && userType === "driver" && <div onClick={() => setOnEdit([onEdit[0], true])} style={{ aspectRatio: "1" }} className="rounded-md cursor-pointer w-min grid place-items-center bg-orange-600 p-2 absolute right-3"><FontAwesomeIcon className="text-white text-sm" icon={faPencil} /></div>}
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="align-middle whitespace-nowrap font-medium">
                                                                Course
                                                            </td>
                                                            {onEdit[1] && <td className="text-xl pl-2 align-middle">:</td>}
                                                            <td className="align-middle pl-3 w-7/12">
                                                                {onEdit[1] ? 
                                                                    <div className="flex items-center w-full">
                                                                        <div className='bg-white my-1 px-2 py-1 w-full transition-all rounded-md border border-gray-400'>
                                                                            <input {...register("extra.course")} placeholder="" type="number" className="outline-none w-full text-sm font-medium" />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    "฿" + iniPrice.course
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle whitespace-nowrap font-medium">
                                                                Tollway
                                                            </td>
                                                            {onEdit[1] && <td className="text-xl pl-2 align-middle">:</td>}
                                                            <td className="align-middle pl-3 w-7/12">
                                                                {onEdit[1] ? 
                                                                    <div className="flex items-center w-full">
                                                                        <div className='bg-white my-1 px-2 py-1 w-full transition-all rounded-md border border-gray-400'>
                                                                            <input {...register("extra.tollway")} placeholder="" type="number" className="outline-none w-full text-sm font-medium" />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    "฿" + iniPrice.tollway
                                                                }
                                                            </td>
                                                        </tr>
                                                        {increment && Object.keys(price).map((item, index) => {
                                                            return (
                                                                <tr key={item}>
                                                                    <td className="align-middle whitespace-nowrap font-medium">
                                                                        {onEdit[1] ? 
                                                                            <div className='bg-white my-1 px-2 py-1 transition-all rounded-md border border-gray-400'>
                                                                                <input {...register(`extra.extra.[${index}].title`)} placeholder="" type="text" className="outline-none w-full text-sm font-medium" />
                                                                            </div>
                                                                            :
                                                                            item
                                                                        }
                                                                    </td>
                                                                    {onEdit[1] && <td className="text-xl pl-2 align-middle">:</td>}
                                                                    <td className="align-middle pl-3 w-7/12">
                                                                        {onEdit[1] ? 
                                                                            <div className="flex items-center w-full">
                                                                                <div className='bg-white my-1 px-2 py-1 w-full transition-all rounded-md border border-gray-400'>
                                                                                    <input {...register(`extra.extra.[${index}].price`)} placeholder="" type="number" className="outline-none w-full text-sm font-medium" />
                                                                                </div>
                                                                                <div onClick={() => addExtraHandle(item, "remove", index)} style={{ aspectRatio: "1" }} className="bg-blue-900 h-7 rounded-md grid place-items-center cursor-pointer ml-2"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>
                                                                            </div>
                                                                            :
                                                                            "฿" + iniPrice.extra[index].price
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                                {onEdit[1] && 
                                                    <div className="flex bg-blue-900 text-white text-lg font-medium w-max text-center rounded-md mb-3 mt-1">
                                                        <div onClick={() => addExtraHandle("", "add")} className="px-3 cursor-pointer text-sm py-1">+ Add</div>
                                                    </div>
                                                }
                                                {onEdit[1] &&
                                                    <div className="grid grid-cols-2 gap-x-3 mt-3">
                                                        <div onClick={() => {
                                                            const temp = {}
                                                            iniPrice.extra.forEach((extra, index) => {
                                                                temp[extra.title] = parseInt(extra.price)
                                                            })
                                                            setOnEdit([onEdit[0], false])
                                                            setPrice({...temp})
                                                        }} className="bg-gray-200 cursor-pointer rounded-md py-2 text-center text-sm font-medium">Cancel</div>
                                                        <button onClick={() => setSubmitType("extra")} type="submit" className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium text-sm">Submit</button>
                                                    </div>
                                                }
                                            </form>
                                            <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full left-0 -translate-y-1/2 -translate-x-1/2 rounded-full">
                                                <div style={{ left: "-2px" }} className="absolute w-5 h-10 bg-white -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                            </div>
                                            <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full right-0 -translate-y-1/2 translate-x-1/2 rounded-full">
                                                <div className="absolute w-5 h-10 bg-white translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                            </div>
                                        </div>
                                        <div className="flex bg-blue-50 rounded-md py-3 px-4 mb-5">
                                            <div className="text-lg font-semibold mr-2">Total:</div>
                                            <div className="text-lg font-semibold text-green-600">฿ {total}</div>
                                        </div>
                                        {userType === "driver" &&
                                            <div className=" mb-5 mt-3">
                                                <div onClick={() => setOnTransfer(true)} className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium">โอนงาน</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TransferJob = ({ bookingData, onTransfer, setOnTransfer, userId }) => {
    const [total, setTotal] = useState(0)
    const [extraCount, setExtraCount] = useState(1)
    const [prices, setPrices] = useState([0, 0, [0]])
    
    const { register, setValue, handleSubmit, unregister, formState: {errors} } = useForm()
    const navigate = useNavigate()

    useEffect(() => {
        let extraTotalPrices = 0
        for (let i = 0; i < prices[2].length; i++) {
            extraTotalPrices += prices[2][i] >= 0 ? prices[2][i] : 0;
        }
        setTotal(prices[0] + prices[1] + extraTotalPrices)
    }, [prices])

    const onSubmit = async (data) => {
        data.bookingId = bookingData.bookingId
        const res = await transferJob(userId, data.bookingId, data.newMessage, data.driver)
        if (res.data === "Successful") {
            alert(res.data)
            navigate('/chat/driver/inbox')
        } else {
            alert(res.data)
        }
    }

    return (
        <div onSubmit={handleSubmit(onSubmit)} className={"bg-black px-5 bg-opacity-30 mb-10 h-screen w-full grid place-items-center top-0 left-0 fixed bg-white transition duration-300 " + (onTransfer ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <form className="bg-white rounded-md py-3 px-3 w-full">
                <div className="text-lg font-semibold mb-2">การโอนงาน</div>
                <div><Textinput onChange={() => {}} error={errors?.driver?.message} register={register(`driver`, { required: "โปรดใส่รหัสคนขับรถ" })} required setValue={setValue} title="รหัสคนขับรถ" /></div>
                <div className="mt-2"><Textinput onChange={() => {}} register={register(`newMessage`)} setValue={setValue} title="ข้อความให้คนขับรถคนใหม่" /></div>
                <div className="grid grid-cols-2 gap-x-3 mt-3">
                    <div onClick={() => setOnTransfer(false)} className="bg-gray-300 cursor-pointer text-gray-800 rounded-md py-2 text-center font-semibold">ยกเลิก</div>
                    <button type="submit" className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium">โอน</button>
                </div>
            </form>
        </div>
    )
}