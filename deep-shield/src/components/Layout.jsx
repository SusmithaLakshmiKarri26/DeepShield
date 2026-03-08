import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
const Layout = () => {
  return (
    <div className="
      min-h-screen transition-all duration-500
      bg-[#ffffff] text-[#140033]
      dark:bg-[#0a001f] dark:text-[#ccc]
    ">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;