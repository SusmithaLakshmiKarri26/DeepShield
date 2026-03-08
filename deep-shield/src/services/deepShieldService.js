import API from "./axiosConfig";

// Encrypt Message
export const encryptMessage = async (message, password) => {
  try {
    const response = await API.post("/encrypt-message", {
      message,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Encryption failed";
  }
};

// Decrypt Message
export const decryptMessage = async (encrypted, password) => {
  try {
    const response = await API.post("/decrypt-message", {
      encrypted,
      password,
    });
    return response.data.decrypted;
  } catch (error) {
    throw error.response?.data?.message || "Decryption failed";
  }
};
