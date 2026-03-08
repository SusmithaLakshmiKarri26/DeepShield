import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const HelpSection = () => {
  return (
    <section
      id="help"
      className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500"
    >
      <div className="max-w-6xl mx-auto p-8">

        <div className="flex flex-col md:flex-row gap-12 items-center">

          {/* Left Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={logo}
              alt="logo"
              className="w-72 h-auto object-contain fade-edges"
            />
          </div>

          {/* Right Content */}
          <div className="w-full md:w-1/2 space-y-8">

            {/* Instructions Section */}
            <div>
              <h4 className="text-3xl font-bold dark:text-[#ccc] mb-2">
                Want to know how to use our application?
              </h4>

              <p className="text-sm text-gray-600 dark:text-[#ccc] mb-4">
                Please refer to the instructions to understand how to encrypt and decrypt your files securely using our platform.
              </p>

              <Link
                to="/instructions"
                className="inline-block px-6 py-3 rounded-lg
                bg-gradient-to-r from-purple-500 to-indigo-500
                text-white font-medium shadow hover:scale-105 transition"
              >
                View Instructions
              </Link>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">

              <p className="text-sm font-semibold dark:text-[#ccc] mb-4">
                For further queries or technical assistance, please contact us via email.
              </p>

              <div className="flex items-center gap-3 text-blue-700 text-sm font-medium underline">
                📧
                <a href="mailto:helpfromencryptedfilevault@gmail.com">
                  helpfromencryptedfilevault@gmail.com
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Extra Help Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="p-6 rounded-xl shadow bg-gray-50 dark:bg-gray-800
          hover:shadow-xl hover:-translate-y-1 transition">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">
              📥 File Not Downloading?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ensure the encrypted URL and password are correct before attempting
              decryption.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl shadow bg-gray-50 dark:bg-gray-800
          hover:shadow-xl hover:-translate-y-1 transition">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">
              📂 Supported File Types
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The system currently supports .txt, .csv, .log, .md and .json
              files for encryption.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl shadow bg-gray-50 dark:bg-gray-800
          hover:shadow-xl hover:-translate-y-1 transition">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">
              🔐 Security Tips
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Always keep your encryption password safe. Without it, the file
              cannot be decrypted.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HelpSection;