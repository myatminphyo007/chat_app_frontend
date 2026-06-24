/* eslint-disable react-refresh/only-export-components */
import { useRef } from "react";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";
const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        return userInfo ? userInfo : null;
    });
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const socket = useRef(null)

    useEffect(() => {
        if (!user) return

        socket.current = io(SOCKET_URL)
        socket.current.emit("set up", user)

        socket.current.on("connected", () => {
            console.log("socket connected for:", user.name);
        });

        return () => socket.current.disconnect();

    }, [user])

    return (
        <ChatContext.Provider value={{
            user, setUser,
            selectedChat, setSelectedChat,
            chats, setChats,
            notifications, setNotifications,
            socket,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used inside ChatProvider");
    return context;
};

export default ChatContext;