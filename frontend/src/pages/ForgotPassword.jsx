import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forget-password", {
        email,
      });
      toast.success("OTP sent to your email");
      localStorage.setItem("email", email);
      navigate("/verify-otp");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 
    ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"}
    text-white py-2 rounded-md transition-colors mb-4`}
        >
          {loading ? (
            <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Send OTP"
          )}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm text-gray-500 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
