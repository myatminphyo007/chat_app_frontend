import { useState } from "react";
import { X } from "lucide-react";
import { useChat } from "../context/ChatContext";
import axiosInstance from "../utils/axiosInstance";

const GroupModal = ({ onClose }) => {
    const { user, chats, setChats, setSelectedChat } = useChat();
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value) {
            setSearchResults([]);
            return;
        }
        try {
            const { data } = await axiosInstance.get(`/api/users?search=${value}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setSearchResults(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addUser = (u) => {
        if (selectedUsers.find(s => s._id === u._id)) return;
        setSelectedUsers([...selectedUsers, u]);
        setSearch("");
        setSearchResults([]);
    };

    const removeUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
    };

    const createGroup = async () => {
        if (!groupName || selectedUsers.length < 2) {
            alert("Please provide a group name and at least 2 members");
            return;
        }
        try {
            setLoading(true);
            const { data } = await axiosInstance.post(
                "/api/chats/group",
                {
                    name: groupName,
                    users: JSON.stringify(selectedUsers.map(u => u._id)),
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setChats([data, ...chats]);
            setSelectedChat(data);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-96 p-5 shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Create Group</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Group Name */}
                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-sm mb-3"
                />

                {/* Search Users */}
                <input
                    type="text"
                    placeholder="Search users to add..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-sm mb-2"
                />

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto mb-3">
                        {searchResults.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => addUser(u)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                                    {u.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{u.name}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedUsers.map((u) => (
                            <div
                                key={u._id}
                                className="flex items-center gap-1 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                            >
                                {u.name}
                                <button onClick={() => removeUser(u._id)}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Button */}
                <button
                    onClick={createGroup}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition-all disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Group"}
                </button>
            </div>
        </div>
    );
};

export default GroupModal;