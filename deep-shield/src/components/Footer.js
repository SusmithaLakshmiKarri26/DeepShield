import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 py-10 px-8">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Project Info */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            Encrypted File Vault
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A secure platform for encrypting and managing your confidential
            files.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-purple-500">Home</Link>
            </li>
            <li>
              <Link to="/encrypt" className="hover:text-purple-500">Encrypt</Link>
            </li>
            <li>
              <Link to="/decrypt" className="hover:text-purple-500">Decrypt</Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-purple-500">Help</Link>
            </li>
          </ul>
        </div>

        {/* Security Note */}
        <div>
          <h3 className="font-semibold mb-3">Security</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All files are encrypted before storage. Only authorized users
            with valid credentials can decrypt and access the original files.
          </p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-5 text-center text-sm">
        © {new Date().getFullYear()} Encrypted File Vault | Secure File Encryption System
      </div>

    </footer>
  );
};

export default Footer;