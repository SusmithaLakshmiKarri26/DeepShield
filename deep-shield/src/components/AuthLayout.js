// src/components/AuthLayout.js
import React from "react";
import logo from "../assets/logo.jpeg";

const AuthLayout = ({ children, title }) => (
  <div className="
    min-h-screen flex items-center justify-center p-6
    bg-[#ffffff]
    dark:bg-[#0a001f]
    transition-all duration-500
  ">

    <div className="
      flex overflow-hidden max-w-5xl w-full rounded-2xl shadow-2xl
      bg-white dark:bg-[#140033]
    ">

      {/* Left Side */}
      <div className="
        hidden md:flex md:w-1/2
        items-center justify-center
        bg-white dark:bg-[#140033]
        p-12
      ">
        <img
          src={logo}
          alt="Logo"
          className="w-72 h-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-10">

        
        <h3 className="
          text-center text-3xl mb-10 font-bold
          text-gray-600
          dark:text-gray-400
        ">
          {title}
        </h3>

        {children}

      </div>

    </div>
  </div>
);

export default AuthLayout;