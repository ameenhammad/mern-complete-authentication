import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    const lastIndex = Math.min(pasteData.length, 6) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp: otpValue }
      );

      toast.success("OTP verified!");
      localStorage.setItem("tempToken", res.data.tempToken);
      navigate("/reset-password");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      toast.success("OTP resent to your email");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
        <p className="mb-4 text-gray-500">
          Enter the 6-digit OTP sent to your email
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl border rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 
            ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} 
            text-white py-2 rounded-md transition-colors`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Verify OTP"
          )}
        </button>

        <p
          onClick={handleResend}
          className="text-sm text-gray-500 mt-4 cursor-pointer hover:underline"
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}
