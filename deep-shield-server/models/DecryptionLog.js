const mongoose = require("mongoose");

const decryptionLogSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  decrypted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ip_address: String,
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("DecryptionLog", decryptionLogSchema);
