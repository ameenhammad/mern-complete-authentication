import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import AuthToggle from "../components/AuthToggle";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User not found") {
        toast.error("User does not exist. Create an account.");
        navigate("/signup");
        return;
      }

      if (message === "Invalid password") {
        toast.error("Incorrect password. Try again.");
        return;
      }

      toast.error(message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <AuthToggle />
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-500 text-center cursor-pointer hover:underline mb-2"
        >
          Forgot password?
        </p>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
