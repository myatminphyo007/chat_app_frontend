import { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password)
        if (pic) {
            formdata.append("profileImage", pic)
        }
        try {
            setLoading(true);
            const { data } = await axiosInstance.post(
                "/api/users/register",
                formdata,
                {
                    headers: {  
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            localStorage.setItem("userInfo", JSON.stringify(data)); 
            navigate("/afterlogin")
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={submitHandler} className="space-y-4">

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />

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
            <label htmlFor="image" className="text-gray-500 text-sm">Profile Picture</label>
            <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setPic(e.target.files[0])}
                className="w-full p-3 border rounded-lg bg-white"
            />

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-300"
            >
                {loading ? "Signing up" : "Signup"}
            </button>

        </form>
    );
};

export default SignUp;