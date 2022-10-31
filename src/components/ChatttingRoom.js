import { faArrowDown, faBook, faBriefcase, faChevronLeft, faCircleInfo, faPaperclip, faPaperPlane, faPencil, faPhone, faTags, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link } from 'react-router-dom';
import {io} from 'socket.io-client';
import { getBookingById, getChattingMessages, getRoomByRoomId, getRoomsByUserId, readChatMessages } from "../apis/backend";
import Numberinput from "./Numberinput";
import Textareainput from "./Textareainput";
import Textinput from "./Textinput";

const connectionOptions =  {
    withCredentials: true,
    transports: ['websocket']
  };

const ChattingRoom = ({ userId }) => {
    const { page, roomId, userType  } = useParams();
    const roomIdEscaped = roomId && roomId.split("&")[0]
    
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

    const getRoomsHandle = async () => {
        const res = await getRoomsByUserId(userId, userType)
        setRooms(res.data)
        console.log(res)
        return res
    }

    useEffect(() => {
        let rooms = []
        const socket = io("https://24e3-2405-9800-b650-586-b0e7-2c78-7def-6cef.ap.ngrok.io", connectionOptions)
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
                {typeof rooms !== "string" && rooms.length > 0 ?
                    rooms.map((room, index) => {
                        var now = moment(new Date()); //todays date
                        var end = moment(room.messages.latestMessage?.createdDate || room.createdDate); // another date
                        var duration = moment.duration(now.diff(end));
                        var days = duration.asDays() <= 1 ? duration.asMinutes() <= 30 ? duration.humanize() + " ago" : end.format("HH.mm") : duration.asDays() >= 2 ? end.format("DD/MM/yyyy") : "yesterday";
                        const messages = room.messages

                        return (
                            <Link key={index} to={`/chat/${userType}/room/${room.roomId}`}>
                                <div className="focus:bg-blue-100 flex justify-between px-5 py-4">
                                    <div className="flex">
                                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                                        <div className="">
                                            <div className="font-medium">{room.name || "Mr.doter onssa"}</div>
                                            {!messages.unreadMessages.length > 0 && <span className="text-gray-500">{messages?.latestMessage?.message}</span>}
                                            {messages.unreadMessages.length > 0 && <span className="font-semibold">{messages.unreadMessages.length > 1 ? messages.unreadMessages.length + " new messages" : messages.unreadMessages[0].message}</span>}
                                            {!messages.latestMessage && <span className="text-gray-500">No message yet.</span>}
                                            <span className="text-right font-medium text-sm text-gray-400 pt-0.5 ml-3 text-ellipsis whitespace-nowrap overflow-hidden">{days}</span>
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
    const [receiverInfo, setReceiverInfo] = useState()
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([])
    const [bookingData, setBookingData] = useState({})
    const [onTransfer, setOnTransfer] = useState(false)
    const [onCheckBookingInfo, setOnCheckBookingInfo] = useState(false)

    const input = useRef()
    if (bookingData.bookingInfo) {
        const dateArray = (bookingData.bookingInfo.start?.pickupDate.split("/").reverse() || bookingData.bookingInfo.pickupDate.split("/").reverse())
        const pickupDate = moment(new Date(dateArray[0], dateArray[1], dateArray[2])).format("DD MMM YYYY")
    }

    useEffect(() => {
        socket = io("https://24e3-2405-9800-b650-586-b0e7-2c78-7def-6cef.ap.ngrok.io", connectionOptions)
        let messageStorage = []
        const getMessage = async () => {
            const res = await getRoomByRoomId(roomId)
            console.log(res)
            const booking = (await getBookingById(res.data[0].bookingId)).data[0]
            booking.bookingInfo = JSON.parse(booking.bookingInfo)
            booking.personalInfo = JSON.parse(booking.personalInfo)
            setBookingData(booking)
            await readChatMessages(roomId, userType)
            const messages = await getChattingMessages(roomId)
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
            roomId,
            inputValue,
            userType,
            userId
        })
    }

    useEffect(() => {
        console.log(messages)
        document.querySelector('html').scrollIntoView({ block: "end" });
    }, [messages])

    return (
        <div className="h-full">
            <div style={{  }} className="py-4 px-5 flex items-center justify-between bg-blue-50 mb-5 sticky top-0">
                <div className="flex items-center w-9/12 overflow-hidden">
                    <Link to={`/chat/${userType}/inbox`}><div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div></Link>
                    <div className="items-center flex overflow-hidden">
                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-10 mr-4"></div>
                        <div className="overflow-hidden pr-1">
                            <div className="font-medium text-lg text-ellipsis whitespace-nowrap overflow-hidden">{receiverInfo?.name || "BoomBeem GIiidsasdak"}</div>
                            {/* <div>{receiverInfo?.status || "Offline"}</div> */}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end w-3/12">
                    <div className="grid place-items-center cursor-pointer mr-5"><FontAwesomeIcon className="text-blue-900 text-xl" icon={faPhone} /></div>
                    <div onClick={() => setOnCheckBookingInfo(current => !current)} className="grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-blue-900 text-2xl" icon={faCircleInfo} /></div>
                </div>
            </div>
            <div className="pb-24 px-3">
                {messages.map((message, index) => {
                    let messageSide = message.senderType === userType ? "right" : "left"
                    
                    return (
                        <div key={index}>
                            <div className={"flex mb-5 " + (messageSide === "right" ? "justify-end" : "justify-start")}>
                                {messageSide === "left" && <div className="w-8 mr-3"><div className="bg-blue-900 text-white grid place-items-center rounded-full w-8 h-8"><FontAwesomeIcon icon={faUser} /></div></div>}
                                <div className={"max-w-xs px-3 py-2 rounded-md " + (messageSide === "left" ? "bg-blue-900 text-white" : "bg-gray-100")}>
                                    <div className="break-normal font-medium">
                                        {messageSide === "left" && <div className="mb-1">{message.translated || "No translated yet"}</div>}
                                        <div className={messageSide === "left" ? "text-white font-light" : ""}>{message.message}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
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
                    <BookingDetail onCheckBookingInfo={onCheckBookingInfo} setOnTransfer={setOnTransfer} setOnCheckBookingInfo={setOnCheckBookingInfo} bookingData={bookingData} userType={userType} />
                    <TransferJob bookingData={bookingData} onTransfer={onTransfer} setOnTransfer={setOnTransfer} />
                </>
            )}
        </div>
    )
}

const BookingDetail = ({ onCheckBookingInfo, setOnCheckBookingInfo, bookingData, userType, setOnTransfer }) => {
    const [onEdit, setOnEdit] = useState([false, false, false])

    return (
        <div className={"h-screen w-full absolute top-0 left-0 bg-white transition duration-300 " + (onCheckBookingInfo ? "translate-x-0" : "translate-x-full")}>
            <div onClick={() => setOnCheckBookingInfo(current => !current)} style={{ boxShadow: "5px 0px 10px 4px rgba(0, 0, 0, 0.15)" }} className="flex px-4 py-4">
                <div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div>
                <div className="font-semibold text-lg">Detail</div>
            </div>
            <div>
                <div>
                    <div className="flex flex-col items-center justify-center pt-8 pb-4">
                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-24"></div>
                        <div className="text-2xl font-semibold mt-3">Duty Driver <span className="text-gray-400 text-lg font-medium">#CA-124</span></div>
                        <div className="mt-3">
                            <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full w-9 grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-white" icon={faPhone} /></div>
                        </div>
                    </div>
                    <div className="px-5 pt-5 bg-white pb-3">
                        <div className="mb-2">
                        </div>
                        <div className="">
                        <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faBook} /></span>Booking Info</div>
                        <div className="bg-blue-50 rounded-lg py-4 px-4 mb-5 relative">
                            {!onEdit[0] && <div onClick={() => setOnEdit([true, onEdit[1], onEdit[2]])} style={{ aspectRatio: "1" }} className="rounded-md cursor-pointer w-min grid place-items-center bg-orange-600 p-2 absolute right-3"><FontAwesomeIcon className="text-white text-sm" icon={faPencil} /></div>}
                            {bookingData.bookingType === "R&H" ?
                            <div className="">
                                {bookingData.bookingInfo.visit.length && (
                                <div>
                                    <div>
                                        <div className="font-semibold w-10/12">{bookingData.bookingInfo.start.place.name}</div>
                                        <div className="-mt-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                        {bookingData.bookingInfo.visit.map((place, index) => {
                                            return (
                                                <div className="flex items-center">
                                                    <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 rounded-full border-yellow-600 font-bold mr-2">
                                                        {index !== 0 && <div className="absolute bottom-full h-5 left-1/2 -translate-x-1/2 w-1 bg-yellow-600"></div>}
                                                    </div>
                                                    {place.place}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="-mb-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                </div>
                                )}
                                <div className="font-semibold mb-3">{bookingData.bookingInfo.end.place.name}</div>
                                <table className="">
                                    <tbody>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Course:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    "Rent & Hire"
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Type:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    bookingData.bookingInfo.type
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Starting:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    bookingData.bookingInfo.start.pickupDate
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Ending:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    bookingData.bookingInfo.end.pickupDate
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Car Type:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    bookingData.bookingInfo.carSize
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Passenger:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    `${bookingData.bookingInfo.passenger.adult} adults, ${bookingData.bookingInfo.passenger.adult} children`
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-top whitespace-nowrap font-medium">Luggage:</td>
                                            <td className="align-top pl-2">
                                                {!onEdit[0] ?
                                                    `${bookingData.bookingInfo.luggage.big} big, ${bookingData.bookingInfo.luggage.medium} medium`
                                                    :
                                                    <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                        <input placeholder="" type="text" className="outline-none w-full" />
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className="">
                                <div className="font-semibold w-10/12">{bookingData.bookingInfo.from.name}</div>
                                <div className="-my-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                                <div className="font-semibold mb-3">{bookingData.bookingInfo.to.name}</div>
                                <table className="">
                                <tbody>
                                    <tr>
                                        <td className="align-top whitespace-nowrap font-medium">Course:</td>
                                        <td className="align-top pl-2">
                                            {!onEdit[0] ?
                                                "A to B Course"
                                                :
                                                <div className={'relative bg-white mb-2 mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                    <input placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="align-top whitespace-nowrap font-medium">Date:</td>
                                        <td className="align-top pl-2">
                                            {!onEdit[0] ?
                                                bookingData.bookingInfo.pickupDate
                                                :
                                                <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                    <input placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="align-top whitespace-nowrap font-medium">Car Type:</td>
                                        <td className="align-top pl-2">
                                            {!onEdit[0] ?
                                                bookingData.bookingInfo.carSize
                                                :
                                                <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                    <input placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="align-top whitespace-nowrap font-medium">Passenger:</td>
                                        <td className="align-top pl-2">
                                            {!onEdit[0] ?
                                                `${bookingData.bookingInfo.passenger.adult} adults, ${bookingData.bookingInfo.passenger.adult} children`
                                                :
                                                <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                    <input placeholder="" type="text" className="outline-none w-full" />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="align-top whitespace-nowrap font-medium">Luggage:</td>
                                        <td className="align-top pl-2">
                                            {!onEdit[0] ?
                                                `${bookingData.bookingInfo.luggage.big} big, ${bookingData.bookingInfo.luggage.medium} medium`
                                                :
                                                <div className={'relative bg-white mb-2 px-4 py-1 transition-all rounded-md border border-gray-400 '}>
                                                    <input placeholder="" type="text" className="outline-none w-full" />
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
                                    <div onClick={() => setOnEdit([false, onEdit[1], onEdit[2]])} className="bg-gray-200 cursor-pointer rounded-md py-2 text-center font-medium">Cancel</div>
                                    <div onClick={() => {}} className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium">Transfer</div>
                                </div>
                            }
                        </div>
                        <div>
                            <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faTags} /></span>Selected Price</div>
                            <div className="bg-blue-50 rounded-lg relative">
                                <div className="border-b-2 border-gray-400 h-full w-full border-dashed py-4 px-4">
                                    <div style={{ aspectRatio: "1" }} className="rounded-md cursor-pointer w-min grid place-items-center bg-orange-600 p-2 absolute right-3"><FontAwesomeIcon className="text-white text-sm" icon={faPencil} /></div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="align-top whitespace-nowrap font-medium">Car Size:</td>
                                                <td className="align-top pl-2">dsa</td>
                                            </tr>
                                            <tr>
                                                <td className="align-top whitespace-nowrap font-medium">Course Price:</td>
                                                <td className="align-top pl-2">25</td>
                                            </tr>
                                            <tr>
                                                <td className="align-top whitespace-nowrap font-medium">Tollway:</td>
                                                <td className="align-top pl-2">36</td>
                                            </tr>
                                            <tr>
                                                <td className="align-top whitespace-nowrap font-medium">Payment:</td>
                                                <td className="align-top pl-2">25</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                    <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full left-0 -translate-y-1/2 -translate-x-1/2 rounded-full">
                                        <div style={{ left: "-2px" }} className="absolute w-5 h-10 bg-white -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    </div>
                                    <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full right-0 -translate-y-1/2 translate-x-1/2 rounded-full">
                                        <div className="absolute w-5 h-10 bg-white translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    </div>
                                </div>
                                <div className="flex bg-blue-50 rounded-md py-3 px-4 mb-5">
                                    <div className="text-lg font-semibold mr-2">Total:</div>
                                    <div className="text-lg font-semibold text-green-600">B 3215</div>
                                </div>
                                {userType === "driver" &&
                                    <div className=" mb-5 mt-3">
                                        {/* <div onClick={() => setOnEdit("booking")} className="bg-orange-600 cursor-pointer text-white rounded-md py-2 text-center font-medium">Edit Booking</div> */}
                                        <div onClick={() => setOnTransfer(true)} className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium">Transfer</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TransferJob = ({ bookingData, onTransfer, setOnTransfer }) => {
    const [total, setTotal] = useState(0)
    const [extraCount, setExtraCount] = useState(1)
    const [prices, setPrices] = useState([0, 0, [0]])
    const [loading, setLoading] = useState(false)
    
    const { register, setValue, handleSubmit, unregister } = useForm()

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
        // data.bookingId = bookingId
        // data.driverId = driverId
    }

    return (
        <div onSubmit={handleSubmit(onSubmit)} className={"bg-black px-5 bg-opacity-30 mb-10 h-screen w-full grid place-items-center top-0 left-0 fixed bg-white transition duration-300 " + (onTransfer ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <form className="bg-white rounded-md py-3 px-3 w-full">
                <div className="text-lg font-semibold mb-2">Transfer Booking</div>
                <div><Textinput onChange={() => {}} register={register(`driver`)} setValue={setValue} title="Driver ID" /></div>
                <div className="grid grid-cols-2 gap-x-3 mt-3">
                    <div onClick={() => setOnTransfer(false)} className="bg-gray-300 cursor-pointer text-gray-800 rounded-md py-2 text-center font-semibold">Cancel</div>
                    <div className="bg-blue-900 cursor-pointer text-white rounded-md py-2 text-center font-medium">Transfer</div>
                </div>
            </form>
        </div>
    )
}