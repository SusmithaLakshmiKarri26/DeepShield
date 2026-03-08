import React, { useEffect, useState } from "react";
import { getMyFiles } from "../services/FileService";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getMyFiles();
        setFiles(data.files);
      } catch (error) {
        console.error("Failed to load files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Encrypted Files</h2>

      {files.length === 0 ? (
        <p>No encrypted files found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Encrypted On</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>{file.fileType}</td>
                <td>{new Date(file.encryptionTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyFiles;
