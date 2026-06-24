import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate()

    const { setUser } = useChat();
    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true)
            const { data } = await axiosInstance.post(
                "/api/users/login",
                { email, password }
            )

            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(data);
            navigate("/afterlogin")

        } catch (err) {
            setError(err.response?.data?.message || "Password or Email isn't correct");
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={submitHandler} className="space-y-4">
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
};

export default Login;