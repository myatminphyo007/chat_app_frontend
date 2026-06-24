import { useEffect, useState } from "react";
import { Search, Users, Trash2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import axiosInstance from "../utils/axiosInstance";
import { getChatName, getChatImage } from "../utils/chatHelpers";
import GroupModal from "./GroupModal";

const Sidebar = () => {
    const { user, chats, setChats, setSelectedChat, selectedChat } = useChat();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/api/chats", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchChats();
        }, 0);
    }, []);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        if (!value) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const { data } = await axiosInstance.get(`/api/users?search=${value}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setSearchResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const openChat = async (userId) => {
        try {
            const { data } = await axiosInstance.post(
                "/api/chats",
                { userId },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (!chats.find(c => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setSearch("");
            setSearchResults([]);
        } catch (err) {
            console.error(err);
        }
    };

    // *** delete chat or group ***
    const deleteChat = async (e, chat) => {
        e.stopPropagation(); // prevent opening the chat when clicking delete

        const confirm = window.confirm(`Are you sure you want to delete "${getChatName(chat, user)}"?`);
        if (!confirm) return;

        try {
            if (chat.isGroupChat) {
                await axiosInstance.delete(`/api/chats/group/${chat._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
            } else {
                await axiosInstance.delete(`/api/chats/${chat._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
            }

            // remove from chats list
            setChats(chats.filter(c => c._id !== chat._id));

            // clear selected chat if it was deleted
            if (selectedChat?._id === chat._id) {
                setSelectedChat(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Could not delete chat");
        }
    };

    // *** check if user can delete ***
    const canDelete = (chat) => {
        if (chat.isGroupChat) {
            // only admin can delete group
            return chat.groupAdmin?._id === user._id || chat.groupAdmin === user._id;
        }
        // any member can delete 1-on-1 chat
        return true;
    };

    return (
        <div className="w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">

            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 relative flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
                    <Search size={16} className="text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={handleSearch}
                        className="bg-transparent outline-none text-sm flex-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
                <button
                    onClick={() => setShowGroupModal(true)}
                    className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all"
                >
                    <Users size={16} />
                </button>

                {/* Search Results Dropdown */}
                {search && (
                    <div className="absolute left-3 right-3 top-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow z-10 max-h-48 overflow-y-auto">
                        {searching ? (
                            <p className="text-xs text-gray-400 p-3">Searching...</p>
                        ) : searchResults.length === 0 ? (
                            <p className="text-xs text-gray-400 p-3">No users found</p>
                        ) : (
                            searchResults.map((u) => (
                                <div
                                    key={u._id}
                                    onClick={() => openChat(u._id)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                                >
                                    {u.profileImage ? (
                                        <img
                                            src={u.profileImage}
                                            alt={u.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-xs">
                                            {u.name?.[0]}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{u.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <p className="text-center text-gray-400 mt-4 text-sm">Loading...</p>
                ) : chats.length === 0 ? (
                    <p className="text-center text-gray-400 mt-4 text-sm">No chats yet</p>
                ) : (
                    chats.map((chat) => {
                        const name = getChatName(chat, user);
                        const image = getChatImage(chat, user);

                        return (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`group flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-all
                                    ${selectedChat?._id === chat._id
                                        ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {image ? (
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
                                        {name?.[0]}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{name}</p>
                                    {chat.latestMessage && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                            {chat.latestMessage.content}
                                        </p>
                                    )}
                                </div>

                                {/* *** delete button - shows on hover, only if allowed *** */}
                                {canDelete(chat) && (
                                    <button
                                        onClick={(e) => deleteChat(e, chat)}
                                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
        </div>
    );
};

export default Sidebar;