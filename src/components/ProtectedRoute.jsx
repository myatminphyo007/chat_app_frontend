import { Navigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useChat();

    if (!user) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;