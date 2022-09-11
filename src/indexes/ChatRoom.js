import liff from "@line/liff/dist/lib";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChattingRoom from "../components/ChatttingRoom"

const ChatRoom = () => {
    const [userId, setUserId] = useState("")
    const { userType } = useParams();

    const initLine = () => {
        const liffId = userType === "driver" ? "1657246657-1A9WmnMw" : "1657246657-zkQEeOoL"
      liff.init({ liffId: liffId }, () => {
        if (liff.isLoggedIn()) {
          runApp();
        } else {
          liff.login();
        }
      }, err => console.error(err));
    }
  
    const runApp = () => {
      const idToken = liff.getIDToken();
      liff.getProfile().then(profile => {
        setUserId(profile.userId)
      }).catch(err => console.error(err));
    }
  
    useEffect(() => {
      initLine();
    }, []);

    return (
        <div>
            <ChattingRoom userId={userId} />
        </div>
    )
}

export default ChatRoom