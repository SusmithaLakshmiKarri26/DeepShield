// Minimal DB check for activity data
require("dotenv").config();
const mongoose = require("mongoose");
const File = require("../models/File");
const DecryptionLog = require("../models/DecryptionLog");

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set in environment.");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);

    const fileCount = await File.countDocuments();
    const logCount = await DecryptionLog.countDocuments();

    const latestFiles = await File.find().sort({ createdAt: -1 }).limit(5);
    const latestLogs = await DecryptionLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("file_id", "original_filename cloud_path");

    console.log("=== Activity DB Check ===");
    console.log(`Files (encrypt records): ${fileCount}`);
    latestFiles.forEach((f, i) => {
      console.log(
        `  [${i + 1}] ${f.original_filename} | user=${f.user_id} | at=${f.createdAt.toISOString()}`
      );
    });

    console.log(`DecryptionLog (decrypt records): ${logCount}`);
    latestLogs.forEach((d, i) => {
      console.log(
        `  [${i + 1}] status=${d.status} | file=${d.file_id?.original_filename || "-"} | ` +
          `by=${d.decrypted_by || "-"} | at=${d.createdAt.toISOString()}`
      );
    });
  } catch (err) {
    console.error("DB check error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
