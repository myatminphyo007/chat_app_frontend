import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";


const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[350px] bg-white p-8 rounded-2xl shadow-lg">

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-lg transition-all duration-300 ${
              isLogin
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-lg transition-all duration-300 ${
              !isLogin
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Components */}
        {isLogin ? <Login /> : <SignUp />}

        {/* Bottom Text */}
        <p className="text-center mt-5 text-sm text-gray-600">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-blue-500 font-semibold"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default HomePage;