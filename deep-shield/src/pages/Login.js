// src/pages/Login.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length === 0) {
  setLoading(true);

  try {
    const response = await api.post(
      "/auth/login",
      formData
    );

    console.log("Login Success:", response.data);

    setLoading(false);

    navigate("/verify-otp", {
      state: { email: formData.email },
    });

  } catch (error) {
    console.error("Login Error:", error);

    setLoading(false);

    if (error.response) {
      setServerError(error.response.data.message);
    } else {
      setServerError("Server not responding");
    }
  }
}
  };

  return (
    <>

      <AuthLayout title="Login to your account">
  <form onSubmit={handleSubmit} className="space-y-5">

    {/* Email */}
    <div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="
          w-full p-3 rounded-lg border
          bg-white dark:bg-[#140033]
          text-[#140033] dark:text-[#ccc]
          border-[#d8b4fe] dark:border-[#6d28d9]
          focus:outline-none focus:ring-2 focus:ring-[#a855f7]
          transition
        "
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>

    {/* Password */}
    <div>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="
          w-full p-3 rounded-lg border
          bg-white dark:bg-[#140033]
          text-[#140033] dark:text-[#ccc]
          border-[#d8b4fe] dark:border-[#6d28d9]
          focus:outline-none focus:ring-2 focus:ring-[#a855f7]
          transition
        "
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
      )}
    </div>

    {/* Server Error */}
    {serverError && (
      <p className="text-red-500 text-sm text-center">
        {serverError}
      </p>
    )}

    {/* Login Button */}
    <button
      type="submit"
      disabled={loading}
      className="
        w-full py-3 rounded-lg font-semibold
        bg-gradient-to-r from-[#a855f7] to-[#6366f1]
        text-white
        hover:scale-105 transition-transform duration-300
      "
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    {/* Signup Link */}
    <p className="
      text-center text-sm mt-4
      text-gray-600 dark:text-gray-400
    ">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="font-semibold text-[#a855f7] hover:underline"
      >
        Sign up
      </Link>
    </p>
    <p className="text-center mt-2"><Link to="/forgotpassword" className="font-semibold text-[#a855f7] hover:underline">
    Forgot password?
    </Link></p>

  </form>
</AuthLayout>
    </>
  );
};

export default LoginPage;
