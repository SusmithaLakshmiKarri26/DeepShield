const axios = require("axios");

const PYTHON_SERVICE_URL = "http://127.0.0.1:5001";

async function encryptMessage(data, password) {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/encrypt`, {
      data: data,
      password: password,
    });

    return response.data;
  } catch (error) {
    console.error("Encryption service FULL error:", error.response?.data || error.message);
    throw new Error("Encryption service unavailable");
  }
}

async function decryptMessage(encryptedData, password) {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/decrypt`, {
      data: encryptedData,   // 🔥 FIXED HERE
      password: password,
    });

    return response.data.decrypted;
  } catch (error) {
    console.error("Decryption service FULL error:", error.response?.data || error.message);
    throw new Error("Decryption service unavailable");
  }
}

module.exports = { encryptMessage, decryptMessage };