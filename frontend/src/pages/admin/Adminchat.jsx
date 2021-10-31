import React,{useState,useEffect} from 'react'
import { admin_data} from '../../data'
import '../assets/styles/Chat.css'
import io from "socket.io-client";

let socket;
const link = 'http://localhost:3001';

function Adminchat({match}) {
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState("");
    const checkChat = (req_data) => {
        return req_data.chat_id === match.params.chatId; 
    }
    const request = admin_data.requests.filter(checkChat)[0]

    useEffect(() => {
        socket = io(link);
        socket.emit("join",match.params.chatId );
    },[]);
    
    useEffect(() => {
        socket.on('message',(data) => {
            setmessages([...messages,data])
        })
    })

    const sendMessage = () => {
        const item = { room: match.params.chatId, message , user:'admin'};
        socket.emit("sendMessage", item);
        setmessage("");
    }

    return (
        <div className="chat-main">
        <div className="messages">
            <div className="message">
            {
                messages.map((item,index) => {
                    if (item.user === "admin"){
                        return (
                        <div className="singlemessage" key={index}>
                            <div className="mess-con user" >
                                <sender>You</sender>
                                <p>{item.message}</p>
                            </div>
                        </div>);
                    }
                    else if (item.user === 'bot'){
                        return (
                            <div className="singlemessage"  key={index}>
                                <div className="mess-con bot">
                                    <sender>Bot</sender>
                                    <p>{item.message}</p>
                                </div>
                            </div>);
                    }
                    else{
                        return (
                        <div className="singlemessage"  key={index}>
                            <div className="mess-con">
                                <sender>User</sender>
                                <p>{item.message}</p>
                            </div>
                        </div>);
                    }
                })
            }
            </div>
            <div className="sendMessage">
                <input type="text" placeholder="Send a message" onChange={(e) => setmessage(e.target.value)} value={message}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
        <div className="chat-head">
            <div className="chat-det">   
                <h1>CHAT</h1>
                <h3>chat-session-id : {match.params.chatId}</h3>
                <h3>admin : {admin_data.admin_name}</h3>
                <h3>admin : {request.user_name}</h3>
            </div>
            <div className="productDetails">
                <h1>DETAILS</h1>
                <h3>Product name : {request.product_name}</h3>
                <h3>Product link : <a href={request.product_link} target="_blank">Link</a></h3>
                <h3>Bank required : {request.bank}</h3>
            </div>
        </div>

        </div>
    )
}

export default Adminchat
