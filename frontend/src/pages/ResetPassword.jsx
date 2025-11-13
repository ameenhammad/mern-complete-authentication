import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const tempToken = localStorage.getItem("tempToken");

  const handleReset = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email || !tempToken) {
      toast.error("Missing reset information. Please start again.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        tempToken,
        newPassword,
      });
      toast.success("Password reset successfully");

      localStorage.removeItem("email");
      localStorage.removeItem("tempToken");

      setTimeout(() => navigate("/login"), 400);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 
            ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"}
            text-white py-2 rounded-md transition-all mb-4`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Reset Password"
          )}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-gray-500 mt-2 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
