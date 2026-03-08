const File = require("../models/File");
const DecryptionLog = require("../models/DecryptionLog");
const supabase = require("../config/supabaseClient");
const axios = require("axios");
const crypto = require("crypto");

// 🔐 Upload encrypted file to Supabase
const uploadToSupabase = async (buffer, fileName, userId) => {
  const uniqueFileName = `${userId}_${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage
    .from("encrypted-files")
    .upload(uniqueFileName, buffer, {
      contentType: "application/octet-stream",
    });

  if (error) throw error;

  return data.path;
};

// ================================
// 🔐 Encrypt & Upload
// ================================
exports.encryptAndUpload = async (req, res) => {
  console.log("🔥 encryptAndUpload controller hit");
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const password = req.body.password;
    if (!password)
      return res.status(400).json({ message: "Password required" });

    const fileBuffer = req.file.buffer;

    const encryptedData = encryptFile(fileBuffer, password);
    const encryptedBuffer = encryptedData.encryptedBuffer;
    const encryptedKey = encryptedData.encryptedKey;

    const filePath = await uploadToSupabase(
      encryptedBuffer,
      req.file.originalname,
      req.user._id
    );

    const file = await File.create({
  user_id: req.user._id,
  original_filename: req.file.originalname,
  cloud_url: filePath,
  encrypted_key: encryptedKey,
});

console.log("Saved file object:", file);

    res.status(201).json({
      message: "File encrypted & uploaded successfully",
      file,
    });

  }catch (error) {
  console.error("FULL ERROR:", error);
  res.status(500).json({ message: error.message });
}
};

// ================================
// 📂 Get User Files
// ================================
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user_id: req.user._id })
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};

// ================================
// 📜 Decrypt File
// ================================
exports.decryptFile = async (req, res) => {
  try {
    const { fileUrl, password } = req.body;

    if (!fileUrl || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔥 Extract filename from URL
    const fileName = fileUrl.split("/").pop();

    // 🔎 Find file using cloud_url
    const file = await File.findOne({ cloud_url: fileName });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 🔗 Create signed URL from Supabase
    const { data, error } = await supabase.storage
      .from("encrypted-files")
      .createSignedUrl(file.cloud_url, 60);

    if (error) throw error;

    const response = await axios.get(data.signedUrl, {
      responseType: "arraybuffer",
    });

    const encryptedBuffer = Buffer.from(response.data);

    // 🔐 Derive key from password
    const derivedKey = crypto
      .createHash("sha256")
      .update(password)
      .digest();

    // ❌ Wrong password check
    if (derivedKey.toString("hex") !== file.encrypted_key) {
      await DecryptionLog.create({
        file_id: file._id,
        owner_id: file.user_id,
        decrypted_by: req.user?._id || null,
        ip_address: req.ip,
        status: "FAILED",
      });

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 🔓 Extract IV from file
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedContent = encryptedBuffer.slice(16);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      derivedKey,
      iv
    );

    let decrypted = decipher.update(encryptedContent);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    await DecryptionLog.create({
      file_id: file._id,
      owner_id: file.user_id,
      decrypted_by: req.user?._id || null,
      ip_address: req.ip,
      status: "SUCCESS",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.original_filename}`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    res.send(decrypted);

  } catch (error) {
    console.error("Decrypt Error:", error);
    res.status(500).json({
      message: "Decryption failed",
    });
  }
};