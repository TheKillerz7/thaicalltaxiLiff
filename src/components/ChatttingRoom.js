import { faChevronLeft, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';

const ChattingRoom = ({ disableRooms, sendingMessage, rooms }) => {
    const { page, roomId } = useParams();

    useEffect(() => {
        if (disableRooms) {
            
        }
    }, [])

    return (
        <div>
            {page === "inboxes" ?
                <RoomsPage rooms={rooms} />
                :
                <ChatPage roomId={roomId} />
            }
        </div>
    )
}

export default ChattingRoom

const RoomsPage = ({ rooms }) => {
    rooms = [
        {
            roomId: "95swfFS8",
            name: "Beemo finguin",
            unreadMessages: ["Heelo misula!"],
            latestMessageTimestamp: "1590156"
        },
        {
            roomId: "95swfFS8",
            name: "Beemo finguin",
            latestMessage: "Hello mabole!",
            latestMessageTimestamp: "1590156"
        },
        {
            roomId: "95swfFS8",
            name: "Beemo finguin",
            latestMessage: "Hello mabole!",
            latestMessageTimestamp: "1590156"
        },
        {
            roomId: "95swfFS8",
            name: "Beemo finguin",
            unreadMessages: ["Heelo misula!", "Oi!"],
            latestMessageTimestamp: "1590156"
        }
    ]

    useEffect(() => {
        
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center pt-12 pb-5 px-5 bg-gray-100">
                <div className="text-3xl font-semibold">Chats</div>
            </div>
            <div className="w-full py-4">
                {rooms && rooms.length ?
                    rooms.map((room) => {
                        return (
                            <Link to={`/chat/room/${room.roomId}`}>
                                <div className="focus:bg-blue-100 flex justify-between px-5 py-4">
                                    <div className="flex">
                                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                                        <div className="">
                                            <div className="">{room.name}</div>
                                            {room.latestMessage && <div className="text-gray-500">{room.latestMessage}</div>}
                                            {room.unreadMessages && <div className="font-semibold">{room.unreadMessages.length > 1 ? room.unreadMessages.length + " new messages" : room.unreadMessages}</div>}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-400 pt-0.5">12 mins ago</div>
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

const ChatPage = ({ roomId }) => {
    const [receiverInfo, setReceiverInfo] = useState()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        
    }, [])

    return (
        <div>
            <div className="py-6 px-5 flex items-center justify-between">
                <div className="flex items-center">
                    <div><FontAwesomeIcon className="text-2xl mr-5" icon={faChevronLeft} /></div>
                    <div className="flex">
                        <div style={{ aspectRatio: "1" }} className="bg-blue-900 rounded-full h-12 mr-4"></div>
                        <div>
                            <div className="font-medium text-lg leading-snug">{receiverInfo?.name || "BoomBeem GIiik"}</div>
                            <div>{receiverInfo?.status || "Offline"}</div>
                        </div>
                    </div>
                </div>
                <div><FontAwesomeIcon className="text-blue-900 text-2xl" icon={faPhone} /></div>
            </div>
            <div>

            </div>
            <div className="py-5 px-5 fixed bottom-0 w-full">
                <div className="bg-gray-200 rounded-full py-3 w-full">
                    <div className="px-5">dsa</div>
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}