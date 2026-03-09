import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      setMessage("Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired token"
      );
    }
  };

  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full p-3 rounded-lg border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
          "
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="
            w-full p-3 rounded-lg border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
          "
        />

        {message && (
          <p className="text-green-500 text-sm text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[#a855f7] to-[#6366f1]
            text-white
            hover:scale-105 transition
          "
        >
          Reset Password
        </button>

      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
