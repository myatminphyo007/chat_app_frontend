import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../context/ChatContext";

const AfterSignup = () => {
    const { selectedChat } = useChat();

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* On mobile: full width, on desktop: fixed 320px */}
                <div className={`w-full md:w-80 flex-shrink-0 flex-col h-full ${selectedChat ? "hidden md:flex" : "flex"}`}>
                    <Sidebar />
                </div>

                {/* On mobile: show chat only if chat selected */}
                <div className={`
                    flex-1
                    ${selectedChat ? "flex" : "hidden md:flex"}
                    flex-col h-full
                `}>
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default AfterSignup;