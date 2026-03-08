import React, { useState } from "react";
import { encryptMessage, decryptMessage } from "../services/deepShieldService";

function DeepShieldDemo() {
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState("");

  const handleEncrypt = async () => {
    const message = "Hello DeepShield AES!";
    const password = "Key$123";
    const encrypted = await encryptMessage(message, password);
    console.log("Encrypted:", encrypted);
    setEncryptedData(encrypted);
  };

  const handleDecrypt = async () => {
    if (!encryptedData) return;
    const password = "Key$123";
    const decrypted = await decryptMessage(encryptedData, password);
    console.log("Decrypted:", decrypted);
    setDecryptedData(decrypted);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>DeepShield AES Demo</h1>
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt} disabled={!encryptedData}>Decrypt</button>

      {encryptedData && (
        <div>
          <h3>Encrypted Data:</h3>
          <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
        </div>
      )}

      {decryptedData && (
        <div>
          <h3>Decrypted Data:</h3>
          <p>{decryptedData}</p>
        </div>
      )}
    </div>
  );
}

export default DeepShieldDemo;
