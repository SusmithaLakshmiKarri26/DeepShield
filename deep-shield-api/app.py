from flask import Flask, request, jsonify
from encrypt.deepshield_aes import encrypt_data, decrypt_data
import base64
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# ================= ENCRYPT =================
@app.route("/encrypt", methods=["POST"])
def encrypt():
    try:
        data = request.json.get("data")
        password = request.json.get("password")

        if not data or not password:
            return jsonify({"error": "Missing data or password"}), 400

        # 🔥 Step 1: Decode base64 coming from frontend
        file_bytes = base64.b64decode(data)

        # 🔥 Step 2: Encrypt raw bytes
        encrypted_blob = encrypt_data(file_bytes, password)

        # 🔥 Step 3: Convert encrypted blob to base64 for JSON
        encrypted_b64 = base64.b64encode(encrypted_blob).decode()

        return jsonify({"encrypted_file": encrypted_b64}), 200

    except Exception as e:
        print("Encrypt error:", str(e))
        return jsonify({"error": str(e)}), 500


# ================= DECRYPT =================
@app.route("/decrypt", methods=["POST"])
def decrypt():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        encrypted_b64 = data.get("encrypted_file")
        password = data.get("password")

        if not encrypted_b64 or not password:
            return jsonify({"error": "Missing encrypted_file or password"}), 400

        # Step 1: Decode base64 → original encrypted binary blob
        encrypted_blob = base64.b64decode(encrypted_b64)

        # Step 2: Decrypt → get original file bytes
        decrypted_bytes = decrypt_data(encrypted_blob, password)

        # Step 3: Convert decrypted bytes to base64 (safe for JSON transport)
        decrypted_b64 = base64.b64encode(decrypted_bytes).decode("utf-8")
        #print("TYPE:", type(decrypted_bytes))
        #print("RAW:", decrypted_bytes)
        # Step 4: Return base64 string to Node
        return jsonify({"decrypted": decrypted_b64}), 200

    except Exception as e:
        print("DECRYPT ERROR:", str(e))
        return jsonify({
            "error": "Decryption failed. Wrong password or corrupted data."
        }), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
