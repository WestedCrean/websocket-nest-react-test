import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';

const NEW_CHAT_MESSAGE_EVENT = "message";
const SOCKET_SERVER_URL = "http://localhost:5050/streams";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { transports: ["websocket"]});

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        text: message,
        ownedByCurrentUser: false,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, messageBody);
  };

  return { messages, sendMessage };
};

export default useChat;