import React, { useEffect, useMemo, useState } from 'react';
import {io} from "socket.io-client";
import { FaUserCircle } from "react-icons/fa";

const App = () => {
  const socket = useMemo(() =>{
    return io("http://localhost:3000");
  }, [])

  const roomName = "multiUserRoom";

  const [message,setMessage] = useState("");
  const [isJoined,setIsJoined] = useState(false);
  const [messages,setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, roomName});
    setMessage("");
  };

  const joinRoomHandler = () => {
    socket.emit("join-room", roomName);
    setIsJoined(true);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })

    return () => {
      socket.disconnect();
    }
  },[]);

  return (
    <div className='chat'>
      <div className='chat__header'>
        <h3>Welcome to ChatApp using Socket.io</h3>
      </div>
      <div className='chat__body'>
        <button className='btn' onClick={joinRoomHandler}>Start chating</button>
        { isJoined &&
            <div className='chat__box'>
              <div className='chat__box__screen'>
                {
                  messages.map((m,i) => (
                    <div key={i} className='chat__box__msg' >
                      <FaUserCircle className='chat__box__msg__icon' />
                      <div className="chat__box__msg__content">{m}</div>
                    </div>
                  ))
                }
              </div>
              <form onSubmit={handleSubmit}>
                    <input type='text' className='inputText' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button type='submit' className='btn'>Send Message</button>
              </form>
            </div>
        }
        
      </div>
    </div>
  )
}

export default App