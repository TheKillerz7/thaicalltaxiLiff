import { faChevronLeft, faCircleInfo, faPaperclip, faPaperPlane, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import {io} from 'socket.io-client';
import { getChattingMessages, getDriverById, getRoomsByUserId, readChatMessages } from "../apis/backend";

const connectionOptions =  {
    withCredentials: true,
    transports: ['websocket']
  };

const ChattingRoom = ({ userId }) => {
    const { page, roomId, userType  } = useParams();
    
    return (
        <div>
            {page === "inbox" ?
                <RoomsPage userType={userType} userId={userId}  />
                :
                <ChatPage userType={userType} roomId={roomId} userId={userId}  />
            }
        </div>
    )
}

export default ChattingRoom

const RoomsPage = ({ userId, userType }) => {
    const [rooms, setRooms] = useState([])

    const getRoomsHandle = async () => {
        const res = await getRoomsByUserId(userId, userType)
        setRooms([...res.data])
        return res
    }

    useEffect(() => {
        let rooms = []
        const socket = io("https://a2d3-49-228-105-212.ap.ngrok.io", connectionOptions)
        socket.on('connect', async () => {
            console.log('connect')
            const res = await getRoomsHandle()
            const roomIds = typeof res.data !== "string" && res?.data?.map((room, index) => {
                return room.roomId
            })
            rooms = [...roomIds]
            if (roomIds?.length) socket.emit("join", [...roomIds])
        });
        socket.on('message', (message) => {
            console.log(message)
            getRoomsHandle()
        });
        socket.on('disconnect', () => {

        });
        return () => {
            console.log(rooms)
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
                {typeof rooms !== "string" && rooms?.length ?
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
                                            <span className="text-right font-medium text-sm text-gray-400 pt-0.5 ml-3">{days}</span>
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
    const input = useRef()

    useEffect(() => {
        socket = io("https://a2d3-49-228-105-212.ap.ngrok.io", connectionOptions)
        let messageStorage = []
        const getMessage = async () => {
            // const chatOpponent = userType === "user" ? await getBook() : await getDriverById
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
        <div>
            <div style={{  }} className="py-6 px-5 flex items-center justify-between bg-blue-50 mb-5 sticky top-0">
                <div className="flex items-center">
                    <Link to={`/chat/${userType}/inbox`}><div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div></Link>
                    <div className="flex">
                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                        <div>
                            <div className="font-medium text-lg">{receiverInfo?.name || "BoomBeem GIiik"}</div>
                            {/* <div>{receiverInfo?.status || "Offline"}</div> */}
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="grid place-items-center cursor-pointer mr-5"><FontAwesomeIcon className="text-blue-900 text-xl" icon={faPhone} /></div>
                    <div className="grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-blue-900 text-2xl" icon={faCircleInfo} /></div>
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
            <div className="py-5 px-5 fixed bottom-0 w-full bg-white">
                <div className="bg-gray-200 rounded-full py-2 w-full flex justify-between items-center">
                    <div className="px-5 w-full"><input ref={input} onChange={(e) => setInputValue(e.target.value)} placeholder="Type here..." className="bg-transparent font-medium text-lg w-full outline-none" /></div>
                    <div className="flex items-center w-max pr-3">
                        {/* <div><FontAwesomeIcon className="text-2xl rotate-45 mr-3 cursor-pointer" icon={faPaperclip} /></div> */}
                        <div onClick={sendMessageHandle} style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full w-9 grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-white" icon={faPaperPlane} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}