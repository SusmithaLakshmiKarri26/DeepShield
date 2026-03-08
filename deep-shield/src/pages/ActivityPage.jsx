import React, { useEffect, useState } from "react";
import { Lock, Unlock, Eye } from "lucide-react";
const ActivityPage = () => {
  const [encryptedFiles, setEncryptedFiles] = useState([]);
  const [decryptedFiles, setDecryptedFiles] = useState([]);
  const [decryptedByOthers, setDecryptedByOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${API_URL}/api/activity`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        console.log("Activity API Response:", data);

        // Separate encrypt & decrypt logs
        setEncryptedFiles(data.filter(item => item.action === "ENCRYPT"));
        setDecryptedFiles(data.filter(item => item.action === "DECRYPT"));
        setDecryptedByOthers(data.filter(item => item.action === "DECRYPT_BY_OTHER"));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load activity", err);
        setLoading(false);
      }
    };

    fetchActivity();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a001f] p-10">
      <h2 className="text-center text-3xl mb-10 font-bold
          text-gray-600
          dark:text-gray-400">
        File Activity Dashboard
      </h2>

      <div className="space-y-12 max-w-6xl mx-auto">

        {/* 🔒 Encrypted Files */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#140033] dark:text-[#ccc]">
            <Lock className="w-5 h-5 text-blue-600 dark:text-[#b366ff]" /> Your Encrypted Files
          </h3>

          <div className="overflow-x-auto border rounded-xl shadow-sm bg-white dark:bg-[#140033] border-[#d8b4fe] dark:border-[#2a1757]">
            <table className="w-full text-left text-sm text-[#140033] dark:text-[#ccc]">
              <thead className="bg-gray-50 dark:bg-[#0f0a2a] border-b border-[#d8b4fe] dark:border-[#2a1757]">
                <tr>
                  <th className="p-4">File Name</th>
                  <th className="p-4">URL</th>
                  <th className="p-4">Encrypted Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee] dark:divide-[#2a1757]">
                {encryptedFiles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400 dark:text-gray-500">
                      No encrypted files found
                    </td>
                  </tr>
                ) : (
                  encryptedFiles.map((file) => (
                    <tr key={file._id}>
                      <td className="p-4">{file.fileName}</td>
                      <td className="p-4 text-blue-500 dark:text-blue-300 underline italic">
                        {file.fileUrl ? (
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                          Access File</a>) : "-"}
                      </td>
                      <td className="p-4">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 🔓 Decrypted Files */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#140033] dark:text-[#ccc]">
            <Unlock className="w-5 h-5 text-green-600 dark:text-[#b366ff]" /> Your Decrypted Files
          </h3>

          <div className="overflow-x-auto border rounded-xl shadow-sm bg-white dark:bg-[#140033] border-[#d8b4fe] dark:border-[#2a1757]">
            <table className="w-full text-left text-sm text-[#140033] dark:text-[#ccc]">
              <thead className="bg-gray-50 dark:bg-[#0f0a2a] border-b border-[#d8b4fe] dark:border-[#2a1757]">
                <tr>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Decrypted Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee] dark:divide-[#2a1757]">
                {decryptedFiles.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-4 text-center text-gray-400 dark:text-gray-500">
                      No decryption activity found
                    </td>
                  </tr>
                ) : (
                  decryptedFiles.map((file) => (
                    <tr key={file._id}>
                      <td className="p-4">{file.fileName}</td>
                      <td className="p-4">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* 👀 Your Files Decrypted By Others */}
<section>
  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#140033] dark:text-[#ccc]">
  <Eye className="w-5 h-5 text-purple-600" />
  Files Decrypted by Other Users
</h3>

  <div className="overflow-x-auto border rounded-xl shadow-sm bg-white dark:bg-[#140033] border-[#d8b4fe] dark:border-[#2a1757]">
    <table className="w-full text-left text-sm text-[#140033] dark:text-[#ccc]">
      <thead>
        <tr>
          <th className="p-4">File Name</th>
          <th className="p-4">Decrypted By</th>
          <th className="p-4">Time</th>
        </tr>
      </thead>

      <tbody>
        {decryptedByOthers.length === 0 ? (
          <tr>
            <td colSpan="3" className="p-4 text-center text-gray-400">
              No one decrypted your files yet
            </td>
          </tr>
        ) : (
          decryptedByOthers.map((file) => (
            <tr key={file._id}>
              <td className="p-4">{file.fileName}</td>
              <td className="p-4">{file.decryptedBy}</td>
              <td className="p-4">
                {new Date(file.createdAt).toLocaleString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</section>

      </div>
    </div>
  );
};

export default ActivityPage;
