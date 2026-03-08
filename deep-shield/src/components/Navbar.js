import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="w-full px-6 py-4 border-b transition-all duration-300
      bg-[#ffffff] border-[#b366ff]
      dark:bg-[#060012] dark:border-[#6d28d9]">

      <div className="flex items-center justify-between">

        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 rounded"
          />

          <h1 className="text-xl font-bold 
            text-[#1e004d] 
            dark:text-[#b366ff]">
            Encrypted File Vault
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium">

          <Link to="/encrypt"
            className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 transition">
            Encrypt
          </Link>

          <Link to="/decrypt"
            className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 transition">
            Decrypt
          </Link>

          <Link to="/activity"
            className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 transition">
            Activity
          </Link>

          <Link to="/instructions"
            className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 transition">
            Instructions
          </Link>

          <Link to="/help"
            className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 transition">
            Help
          </Link>

          <div className="space-x-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login"
                  className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Login
                </Link>

                <Link to="/signup"
                  className="text-[#140033] dark:text-[#ccc] hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
                Logout
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl ml-2 transition text-[#1e004d] dark:text-[#b366ff]">
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-[#1e004d] dark:text-[#b366ff]"
          onClick={() => setOpen(!open)}>
          ☰
        </button>

      </div>
    </nav>
  );
};

export default Navbar;