const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    original_filename: {
      type: String,
      required: true,
    },
    output_filename: {   
    type: String,
    required: true,
  },
    mime_type: {
      type: String,   // ⭐ ADD THIS
      required: true,
    },
    cloud_path: {
      type: String,   // path inside Supabase bucket
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);