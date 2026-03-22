import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import InstructionsSection from "./InstructionsSection";
import HelpSection from "./HelpSection";
import Footer from "../components/Footer";
import logo from "../assets/logo.jpeg";

const LandingPage = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between 
      px-8 md:px-24 py-24 bg-white dark:bg-gray-900 transition-colors duration-300">

        {/* Logo */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center mb-12 md:mb-0"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={logo}
            alt="Encrypted File Vault Logo"
            className="w-80 md:w-96 drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="w-full md:w-1/2 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-6xl font-extrabold leading-tight
          bg-gradient-to-r from-[#a855f7] to-[#6366f1]
          bg-clip-text text-transparent">
            DeepShield AES
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            DeepShield AES - An <i>ENCRYPTED FILE VAULT</i> provides a secure platform to encrypt,
            store, and manage sensitive text files. Maintain full control
            over your data with strong encryption and protected access.
          </p>
          <h3 className="text-xl text-gray-600 dark:text-gray-400">
            Secure Your Files with Encryption
          </h3>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">

            <Link
              to="/login"
              className="px-8 py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-[#a855f7] to-[#6366f1]
              shadow-lg hover:scale-105 transition"
            >
              Get Started →
            </Link>

            <a
              href="#instructions"
              className="px-8 py-3 rounded-lg font-semibold
              border border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Learn More
            </a>

          </div>
        </motion.div>
      </section>

      

      {/* INSTRUCTIONS */}
      <InstructionsSection />

      {/* HELP */}
      <HelpSection />

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default LandingPage;