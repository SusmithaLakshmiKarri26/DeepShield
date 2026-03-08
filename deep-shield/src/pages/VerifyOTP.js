// src/pages/VerifyOTP.js

import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import { AuthContext } from "../context/AuthContext";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // 🔐 Prevent direct access without email (refresh protection)
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next box automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp: enteredOtp,
        }
      );

      const token = response.data.token;

      // 🔥 Safety check
      if (!token) {
        setError("Invalid server response");
        return;
      }

      // ⏳ Session expiry (1 hour)
      const expiry = Date.now() + 60 * 60 * 1000;

      // ✅ Login through AuthContext (important!)
      login(token, expiry);

      // 🚀 Redirect to home/dashboard
      navigate("/home");

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Enter OTP sent to your email">
      <div className="space-y-6">

        {email && (
          <p className="text-sm text-gray-600 text-center">
            OTP sent to: <span className="font-semibold">{email}</span>
          </p>
        )}

        {/* OTP Input Boxes */}
        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-12 h-12 text-center text-xl font-bold
                text-blue-900 dark:text-blue-900
                border-2 rounded-lg
                focus:border-blue-500 outline-none"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full inline-block mt-4 px-8 py-3 rounded-lg text-white font-semibold
            bg-gradient-to-r from-[#a855f7] to-[#6366f1]
            shadow-lg hover:scale-105 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;