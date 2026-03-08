import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, FileText } from "lucide-react";

const features = [
  {
    title: "Advanced Encryption",
    desc: "Files are encrypted using strong cryptographic algorithms before storage to ensure complete confidentiality.",
    icon: <Lock size={40} className="text-purple-500" />,
  },
  {
    title: "Secure File Storage",
    desc: "Encrypted files are securely stored in cloud storage, preventing unauthorized access to sensitive data.",
    icon: <Shield size={40} className="text-purple-500" />,
  },
  {
    title: "Authorized Decryption",
    desc: "Only authenticated users with valid credentials can decrypt and access stored files.",
    icon: <UserCheck size={40} className="text-purple-500" />,
  },
  {
    title: "Activity Logging",
    desc: "Every decryption request is logged to monitor file access and detect suspicious activities.",
    icon: <FileText size={40} className="text-purple-500" />,
  },
];

const instructions = [
  {
    icon: <Shield size={36} className="text-indigo-500" />,
    text: "Secure your files using strong encryption to ensure that only authorized users can access sensitive data.",
  },
  {
    icon: <Lock size={36} className="text-indigo-500" />,
    text: "After encryption, store the encrypted file URL and password safely as they are required for decryption later.",
  },
  {
    icon: <UserCheck size={36} className="text-indigo-500" />,
    text: "Avoid sharing encrypted URLs and passwords with unauthorized users to maintain confidentiality.",
  },
  {
    icon: <FileText size={36} className="text-indigo-500" />,
    text: "If you experience any issues with encryption or decryption, please contact the support team for assistance.",
  },
];

const InstructionsSection = () => {
  return (
    <section
      id="instructions"
      className="py-20 px-8 md:px-20 bg-gray-50 dark:bg-gray-900"
    >
      {/* SECTION TITLE */}
      <h2
        className="text-4xl font-bold text-center mb-4
        bg-gradient-to-r from-[#a855f7] to-[#6366f1]
        bg-clip-text text-transparent"
      >
        Our Security Features
      </h2>

      {/* FEATURES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-4">{feature.icon}</div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {feature.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* DIVIDER */}
      <div className="w-24 h-1 mx-auto mb-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>

      {/* GUIDELINES TITLE */}
      <h2
        className="text-3xl font-bold text-center mb-10
        bg-gradient-to-r from-[#a855f7] to-[#6366f1]
        bg-clip-text text-transparent"
      >
        Important Security Guidelines
      </h2>

      {/* INSTRUCTIONS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {instructions.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-4">{item.icon}</div>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* SECURITY REMINDER */}
      <div className="mt-20 bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 p-8 rounded-xl text-center max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-purple-600 mb-2">
          Security Reminder
        </h3>

        <p className="text-gray-600 dark:text-gray-400">
          Always store your encryption password securely. Losing the password
          may result in permanent loss of access to your encrypted files.
        </p>
      </div>
    </section>
  );
};

export default InstructionsSection;