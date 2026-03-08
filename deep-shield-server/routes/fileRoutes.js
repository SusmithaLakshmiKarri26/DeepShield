const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
const File = require("../models/File");
const DecryptionLog = require("../models/DecryptionLog");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/protect");
const mongoose = require("mongoose");
const router = express.Router();
const upload = multer();
const allowedExtensions = [
  ".txt",
  ".csv",
  ".log",
  ".md",
  ".markdown",
  ".json"
];

const allowedMimeTypes = [
  "text/plain",
  "text/csv",
  "application/json",
  "text/markdown"
];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
const PYTHON_SERVICE_URL = "http://127.0.0.1:5001";

router.post("/encrypt", protect, upload.single("file"), async (req, res) => {
  try {
    const { password,outfileName } = req.body;

    if (!req.file || !password) {
      return res.status(400).json({ message: "File and password required" });
    }
    const fileExtension = req.file.originalname
  .toLowerCase()
  .substring(req.file.originalname.lastIndexOf("."));

    if (
  !allowedExtensions.includes(fileExtension) ||
  !allowedMimeTypes.includes(req.file.mimetype)
) {
  return res.status(400).json({
    message:
      "Only text files (.txt, .csv, .log, .md, .markdown, .json) are allowed",
  });
}
    // 🔐 Send base64 file data to Python
    const encryptionResponse = await axios.post(
      `${PYTHON_SERVICE_URL}/encrypt`,
      {
        data: req.file.buffer.toString("base64"),
        password,
      }
    );

    const encryptedBase64 = encryptionResponse.data.encrypted_file;

    // convert base64 → binary buffer
    const encryptedBuffer = Buffer.from(encryptedBase64, "base64");

    const safeName = req.file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    const fileName = `${req.user._id}_${Date.now()}_${safeName}.enc`;

    // ☁ Upload ONLY base64 string (no JSON wrapper)
    const { error } = await supabase.storage
  .from("encrypted-files")
  .upload(fileName, encryptedBuffer, {
    contentType: "application/octet-stream"
  });

if (error) throw error;

    if (error) throw error;

    // 🔗 Generate signed URL
    const { data: signedUrlData, error: signedError } =
      await supabase.storage
        .from("encrypted-files")
        .createSignedUrl(fileName, 60 * 60);

    if (signedError) throw signedError;

    // 💾 Save metadata
    const savedFile = await File.create({
  user_id: req.user._id,
  owner_name: `${req.user.firstname} ${req.user.lastname}`,
  original_filename: safeName,
  output_filename: outfileName || safeName,
  mime_type: req.file.mimetype,
  cloud_path: fileName,
});

console.log("Saved file:", savedFile);

    return res.status(200).json({
      message: "File encrypted successfully",
      fileUrl: signedUrlData.signedUrl,
    });

  } catch (err) {
    console.error("Encrypt Error:", err);
    return res.status(500).json({ message: "Encryption failed" });
  }
});


router.post("/decrypt", protect, async (req, res) => {
  try {
    const { fileUrl, password } = req.body;

    if (!fileUrl || !password) {
      return res.status(400).json({
        message: "File URL and password required",
      });
    }

    // 🔥 Extract filename from signed URL
    // 🔥 Extract filename from Supabase signed URL safely
const urlObj = new URL(fileUrl);

// Path example:
// /storage/v1/object/sign/encrypted-files/12345_filename.txt.enc

const pathParts = urlObj.pathname.split("/encrypted-files/");

if (!pathParts[1]) {
  return res.status(400).json({ message: "Invalid file URL" });
}

// Remove query params if any
const fileName = pathParts[1].split("?")[0];

    // 🔎 Find file in MongoDB
    const file = await File.findOne({ cloud_path: fileName });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ☁ Download encrypted base64 string
    const { data, error } = await supabase.storage
      .from("encrypted-files")
      .download(file.cloud_path);

    if (error) throw error;

    const encryptedBuffer = Buffer.from(await data.arrayBuffer());

    // convert to base64 for Python
    const encryptedBase64 = encryptedBuffer.toString("base64");

    // 🔓 Call Python decrypt
    const decryptResponse = await axios.post(
      `${PYTHON_SERVICE_URL}/decrypt`,
      {
        encrypted_file: encryptedBase64,
        password,
      }
    );

    // Convert base64 → original file bytes
    const decryptedBuffer = Buffer.from(
      decryptResponse.data.decrypted,
      "base64"
    );

    const decryptedBy = req.user._id;

    try {
      const logDoc = await DecryptionLog.create({
        file_id: file._id,
        owner_id: file.user_id,
        decrypted_by: decryptedBy,
        ip_address: req.ip,
        status: "SUCCESS"
      });
      console.log("DecryptionLog saved:", logDoc._id.toString());
    } catch (e) {
      console.error("DecryptionLog write error:", e.message);
    }

    let finalName = file.output_filename;
    if (!finalName) {
      finalName = file.original_filename;
    }

if (!finalName.includes(".")) {
  const ext = file.original_filename.split(".").pop();
  finalName = `${finalName}.${ext}`;
}

res.setHeader(
  "Content-Disposition",
  `attachment; filename="${finalName}"`
);

    res.setHeader(
      "Content-Type",
      file.mime_type || "application/octet-stream"
    );

    return res.send(decryptedBuffer);

  } catch (err) {
    console.error("Decrypt Error:", err.response?.data || err.message);

    try {
      const { fileUrl } = req.body || {};
      if (fileUrl) {
        const urlObj = new URL(fileUrl);
        const pathnameParts = urlObj.pathname.split("/");
        const fileName = pathnameParts[pathnameParts.length - 1];
        const file = await File.findOne({ cloud_path: fileName });
        if (file) {
          await DecryptionLog.create({
            file_id: file._id,
            owner_id: file.user_id,
            decrypted_by: null,
            ip_address: req.ip,
            status: "FAILED"
          });
        }
      }
    } catch (e) {
      console.error("DecryptionLog FAILED write error:", e.message);
    }

    return res.status(400).json({
      message: "Invalid password or file URL",
    });
  }
});

module.exports = router;
