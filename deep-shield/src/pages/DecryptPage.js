// src/pages/DecryptPage.js

import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import api from "../api";
const DecryptPage = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError("");

    if (!fileUrl.trim()) return setError("File URL is required");
    if (!password) return setError("Password is required");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post("/files/decrypt", {
  fileUrl,
  password
});

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 🔹 Get filename from backend header
      let fileName = "downloaded-file";

      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        fileName = disposition
          .split("filename=")[1]
          .replace(/"/g, "");
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Decrypt Your File">
      <form onSubmit={handleDecrypt} className="space-y-5">

        {/* File URL */}
        <input
          type="text"
          placeholder="Paste File URL here"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="
            w-full p-3 rounded-lg border
            bg-white dark:bg-[#140033]
            text-[#140033] dark:text-[#ccc]
            border-[#d8b4fe] dark:border-[#6d28d9]
            focus:outline-none focus:ring-2 focus:ring-[#a855f7]
            transition
          "
        />

        {/* Password */}
        {/* Password */}
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="File Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="
      w-full p-3 pr-12 rounded-lg border
      bg-white dark:bg-[#140033]
      text-[#140033] dark:text-[#ccc]
      border-[#d8b4fe] dark:border-[#6d28d9]
      focus:outline-none focus:ring-2 focus:ring-[#a855f7]
      transition
    "
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#a855f7] hover:text-[#9333ea]"
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[#a855f7] to-[#6366f1]
            text-white
            hover:scale-105 transition-transform duration-300
            disabled:opacity-50
          "
        >
          {loading ? "Decrypting..." : "Decrypt"}
        </button>

      </form>
    </AuthLayout>
  );
};

export default DecryptPage;
