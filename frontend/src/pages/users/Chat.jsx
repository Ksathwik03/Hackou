import React,{useState,useEffect} from 'react'
import '../assets/styles/Chat.css'
import io from "socket.io-client";
import axios from 'axios';
import { api } from '../../Api/api';

let socket;
const link = 'http://localhost:3001';

function Chat({match}) {
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState("");
    const [request, setrequest] = useState({"admin_details": {}})
    const username = localStorage.getItem("username")
    let admin = false
    if(localStorage.getItem("username") == "admin"){
      admin = true
    }

    useEffect(async() => {
        const headers = {"x-access-token": localStorage.getItem("token") || null}
        await axios.get(`${api}product/${match.params.chatId}`,headers)
        .then((res) => {
            if(res.status == 200){
            setrequest(res.data.products[0])
            }
        })
    })

    useEffect(() => {

        socket = io(link);
        socket.emit("join",match.params.chatId );
    },[]);
    
    useEffect(() => {
        socket.on('message',(data) => {
            setmessages([...messages,data])
        })
    })

    const sendMessage = (e) => {
        e.preventDefault()
        const item = { room: match.params.chatId, message , user: username};
        socket.emit("sendMessage", item);
        setmessage("");
    }

    return (
        <div className="chat-main">
        <div className="messages">
            <div className="message">
            { messages && 
                messages.map((item,index) => {
                    if (item.user === username){
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
                                    <sender>{admin? "User":"Admin"}</sender>
                                    <p>{item.message}</p>
                                </div>
                            </div>);
                    }
                })
            }
            </div>
            <div className="sendMessage">
                <form onSubmit={sendMessage}>
                    <input type="text" placeholder="Send a message" onChange={(e) => setmessage(e.target.value)} value={message}/>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
        <div className="chat-head">
            <div className="chat-det">   
                <h1>CHAT</h1>
                <h3>chat-session-id : {match.params.chatId}</h3>
                <h3>User : {username}</h3>
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

export default Chat
