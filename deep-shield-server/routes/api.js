const express = require("express");
const router = express.Router();
const { encryptMessage, decryptMessage } = require("../services/cryptoService");

// ================= ENCRYPT =================
router.post("/encrypt", async (req, res) => {
  try {
    const { data, password } = req.body;

    if (!data || !password) {
      return res.status(400).json({ error: "Data and password required" });
    }

    const encrypted = await encryptMessage(data, password);

    res.status(200).json(encrypted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= DECRYPT =================
router.post("/decrypt", async (req, res) => {
  try {
    const { encrypted_file, password } = req.body;

    if (!encrypted_file || !password) {
      return res.status(400).json({ error: "Missing encrypted_file or password" });
    }

    const decrypted = await decryptMessage(encrypted_file, password);

    res.status(200).json({ decrypted });

  } catch (error) {
    console.error("Decrypt Route Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
