import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";

const Navbar = () => {
    const { user } = useChat();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        window.location.href = "/";
    };

    return (
        <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
            {/* Left - App name */}
            <h1 className="text-base md:text-lg font-semibold text-blue-500 whitespace-nowrap">💬 Chat with Me</h1>

            {/* Right - User info + logout */}
            <div className="flex items-center gap-3">
                <img
                    src={user?.profileImage}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <div className="relative group">
                    <button
                        onClick={logout}
                        className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                        <LogOut size={16} />
                    </button>
                    <span className="absolute right-0 top-9 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Logout
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;  