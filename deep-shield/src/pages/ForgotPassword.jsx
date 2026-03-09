import { useState } from "react";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/auth/forgot-password",
        { email }
      );

      setMessage("Reset link sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <AuthLayout title="Recover your account">
      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Send Reset Link
        </button>

      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
