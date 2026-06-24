import { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useChat } from "../context/ChatContext";
import axiosInstance from "../utils/axiosInstance";
import { getChatName, getChatImage } from "../utils/chatHelpers";

const ChatWindow = () => {
    const { user, selectedChat, setSelectedChat, socket } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!selectedChat) return;
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(
                    `/api/messages/${selectedChat._id}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setMessages(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!socket.current) return;

        const messageReceived = (newMsg) => {
            if (selectedChat && selectedChat._id === newMsg.chat._id) {
                setMessages((prev) => [...prev, newMsg]);
            }
        }
        socket.current.on("message received", messageReceived)
        return () => socket.current.off("message received", messageReceived);
    }, [selectedChat])

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            setSending(true);
            const { data } = await axiosInstance.post(
                "/api/messages",
                { content: newMessage, chatId: selectedChat._id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessages([...messages, data]);
            socket.current?.emit("new message", data)
            setNewMessage("");
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    if (!selectedChat) {
        return (
            <div className="flex-1 h-full bg-gray-50 dark:bg-gray-900 hidden md:flex items-center justify-center">
                <p className="text-gray-400 text-sm">Select a chat to start messaging</p>
            </div>
        );
    }

    const name = getChatName(selectedChat, user);
    const image = getChatImage(selectedChat, user);

    return (
        <div className="flex-1 h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                {/* Back button - mobile only */}
                <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden text-gray-500 dark:text-gray-400"
                >
                    <ArrowLeft size={20} />
                </button>

                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
                        {name?.[0]}
                    </div>
                )}
                <p className="font-medium text-gray-800 dark:text-gray-200">{name}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
                {loading ? (
                    <p className="text-center text-gray-400 text-sm">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm">No messages yet</p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender._id === user._id;
                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                                        isMe
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-full outline-none focus:ring-2 focus:ring-blue-400 text-sm px-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                    onClick={sendMessage}
                    disabled={sending}
                    className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;