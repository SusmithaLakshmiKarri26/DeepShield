const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const DecryptionLog = require("../models/DecryptionLog");
const File = require("../models/File");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
router.get("/", protect, async (req, res) => {
  try {

    const userId = req.user._id;

    // Files encrypted by user
    const files = await File.find({ user_id: userId }).sort({ createdAt: -1 });

    // Files decrypted by user
    const decryptLogs = await DecryptionLog.find({
      decrypted_by: userId,
      status: "SUCCESS"
    })
      .populate("file_id", "original_filename cloud_path createdAt")
      .populate("decrypted_by", "firstname lastname")
      .sort({ createdAt: -1 });

    // Files of user decrypted by others
    const decryptedByOthers = await DecryptionLog.find({
      owner_id: userId,
      decrypted_by: { $ne: userId },
      status: "SUCCESS"
    })
    .populate("file_id", "original_filename cloud_path createdAt")
    .populate("decrypted_by", "firstname lastname email")
    .sort({ createdAt: -1 });

    // 🔒 Encrypted
    const encryptItems = await Promise.all(
  files.map(async (f) => {

    const { data } = await supabase.storage
    .from("encrypted-files")
    .createSignedUrl(f.cloud_path, 3600);

    return {
      _id: f._id,
      action: "ENCRYPT",
      fileName: f.original_filename,
      fileUrl: data?.signedUrl || null,
      createdAt: f.createdAt
    };
  })
);

    // 🔓 Decrypted by user
    const decryptItems = decryptLogs.map((d) => ({
      _id: d._id,
      action: "DECRYPT",
      fileName: d.file_id?.original_filename || "-",
      fileUrl: d.file_id?.cloud_path || null,
      createdAt: d.createdAt
    }));

    // 👀 Your files decrypted by others
    
    const decryptedByOtherItems = decryptedByOthers.map((d) => ({
      _id: d._id,
      action: "DECRYPT_BY_OTHER",
      fileName: d.file_id?.original_filename || "-",
      decryptedBy: `${d.decrypted_by?.firstname || ""} ${d.decrypted_by?.lastname || ""}`,
      createdAt: d.createdAt
    }));
    const items = [
      ...encryptItems,
      ...decryptItems,
      ...decryptedByOtherItems
    ].sort((a, b) => b.createdAt - a.createdAt);

    res.json(items);

  } catch (err) {
    console.error("Activity error:", err.message);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
});

module.exports = router;