export const getChatName = (chat, currentUser) => {
    if (chat.isGroupChat) {
        return chat.chatName;
    }
    const otherUser = chat.users.find(u => u._id !== currentUser._id);
    return otherUser?.name;
};

export const getChatImage = (chat, currentUser) => {
    if (chat.isGroupChat) {
        return null;
    }
    const otherUser = chat.users.find(u => u._id !== currentUser._id);
    return otherUser?.profileImage;
};