import { faChevronLeft, faPaperclip, faPaperPlane, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import {io} from 'socket.io-client';
import { getChattingMessages, getRoomsByUserId, readChatMessages } from "../apis/backend";

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

    useEffect(() => {
        const socket = io("https://a924-2405-9800-b650-586-d8ac-eac5-c3d8-7ee5.ap.ngrok.io", connectionOptions)
        socket.on('connect', async () => {
            console.log('connect')
            const res = await getRoomsByUserId(userId, userType)
            setRooms(res.data)
            const roomIds = typeof res.data !== "string" && res?.data?.map((room, index) => {
                console.log(room)
                return room.roomId
            })
            if (roomIds?.length) socket.emit("join", [...roomIds])
        });
        socket.on('disconnect', () => {

        });
        return () => {
            socket.disconnect()
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
                        var end = moment(room.messages.latestMessage?.[0]?.createdDate || room.createdDate); // another date
                        var duration = moment.duration(now.diff(end));
                        var days = duration.asDays() <= 1 ? end.format("HH.mm") : duration.asDays() >= 2 ? end : "yesterday";

                        return (
                            <Link key={index} to={`/chat/${userType}/room/${room.roomId}`}>
                                <div className="focus:bg-blue-100 flex justify-between px-5 py-4">
                                    <div className="flex">
                                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                                        <div className="">
                                            <div className="font-medium">{room.name || "Mr.doter onssa"}</div>
                                            {room.latestMessage && <div className="text-gray-500">{room.messages.latestMessage}</div>}
                                            {room.unreadMessages && <div className="font-semibold">{room.messages.unreadMessages.length > 1 ? room.messages.unreadMessages.length + " new messages" : room.messages.unreadMessages}</div>}
                                            {!room.latestMessage && <div className="text-gray-500">No message yet.</div>}
                                        </div>
                                    </div>
                                    {/* <div className="text-right text-sm text-gray-400 pt-0.5">{days}</div> */}
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

const ChatPage = ({ roomId, userType, userId }) => {
    const [receiverInfo, setReceiverInfo] = useState()
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([])

    const input = useRef()

    useEffect(() => {
        const socket = io("https://a924-2405-9800-b650-586-d8ac-eac5-c3d8-7ee5.ap.ngrok.io", connectionOptions)
        let messageStorage = []
        const getMessage = async () => {
            const messages = await getChattingMessages(roomId)
            messageStorage = [...messages.data.reverse()]
            setMessages([...messageStorage])
        }
        getMessage()
        readChatMessages(roomId, userId)
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
        const socket = io("https://a924-2405-9800-b650-586-d8ac-eac5-c3d8-7ee5.ap.ngrok.io", connectionOptions)
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
                            <div className="font-medium text-lg leading-snug">{receiverInfo?.name || "BoomBeem GIiik"}</div>
                            <div>{receiverInfo?.status || "Offline"}</div>
                        </div>
                    </div>
                </div>
                <div className="grid place-items-center cursor-pointer"><FontAwesomeIcon className="text-blue-900 text-2xl" icon={faPhone} /></div>
            </div>
            <div className="pb-24 px-3">
                {messages.map((message, index) => {
                    let messageSide = message.senderType === userType ? "right" : "left"
                    
                    return (
                        <div key={index}>
                            <div className={"flex mb-5 " + (messageSide === "right" ? "justify-end" : "justify-start")}>
                                {messageSide === "left" && <div className="w-8 mr-3"><div className="bg-blue-900 text-white grid place-items-center rounded-full w-8 h-8"><FontAwesomeIcon icon={faUser} /></div></div>}
                                <div className={"max-w-xs px-3 py-2 rounded-md " + (messageSide === "left" ? "bg-blue-900 text-white" : "bg-gray-100")}>
                                    <p className="break-normal font-medium">{message.message}</p>
                                </div>
                            </div>
                            {messages.length === index + 1 && messageSide === "right" ? 
                                message.status === "read" ? 
                                <div className="text-right text-sm -mt-3 text-gray-500">Read yesterday</div> 
                                : <div className="text-right text-sm -mt-3 text-gray-500">Sent 1m ago</div>
                            : null}
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