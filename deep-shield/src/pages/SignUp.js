import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axios";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";


    if (!formData.email.trim())
      newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password)
      newErrors.password = "Password is required";
    const strong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(
        formData.password
      );
    if (formData.password && !strong)
      newErrors.password =
        "Use 12+ chars with uppercase, lowercase, number, and symbol";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      await api.post(
        "/auth/register",
        {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
      navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
};


  return (
    <>

  <AuthLayout title="Create a new account">
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-5"
    >

      {/* First Name */}
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="
            p-3 rounded-lg w-full border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
            transition
          "
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="
            p-3 rounded-lg w-full border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
            transition
          "
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div className="col-span-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="
            p-3 rounded-lg w-full border
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
            p-3 rounded-lg w-full border
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

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="
            p-3 rounded-lg w-full border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
            transition
          "
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={success}
        className="
          col-span-2 py-3 rounded-lg font-semibold mt-4
          bg-gradient-to-r from-[#a855f7] to-[#6366f1]
          text-white
          hover:scale-105 transition-transform duration-300
        "
      >
        Create Account
      </button>
      {success && (
        <p className="text-green-500 text-sm text-center col-span-2">
        {success}
      </p>
)}

    </form>
  </AuthLayout>
</>
  );
};

export default SignUpPage;