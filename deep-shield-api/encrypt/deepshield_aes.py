import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

# -------------------------------
# Chaotic S-Box Generation
# -------------------------------
def generate_chaotic_sbox(seed: float, r: float = 3.99) -> bytes:
    x = seed
    chaos_vals = []
    for _ in range(256):
        x = r * x * (1 - x)
        chaos_vals.append(x)
    sorted_indices = sorted(range(256), key=lambda i: chaos_vals[i])
    return bytes(sorted_indices)

# -------------------------------
# Key Derivation (PBKDF2)
# -------------------------------
def derive_key(password: str, salt: bytes, length: int = 32) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA512(),
        length=length,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

# -------------------------------
# Encrypt Data
# -------------------------------
def encrypt_data(data: bytes, password: str):
    salt = os.urandom(16)
    nonce = os.urandom(12)

    key = derive_key(password, salt)

    seed = int.from_bytes(key[:4], 'big') / (2**32)
    sbox = generate_chaotic_sbox(seed)

    substituted = bytes([sbox[b] for b in data])

    encryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(nonce),
        backend=default_backend()
    ).encryptor()

    ciphertext = encryptor.update(substituted) + encryptor.finalize()

    # Combine everything into one blob
    combined = salt + nonce + encryptor.tag + ciphertext

    return combined


# -------------------------------
# Decrypt Data
# -------------------------------
def decrypt_data(encrypted_blob: bytes, password: str):
    # Extract components
    salt = encrypted_blob[:16]
    nonce = encrypted_blob[16:28]
    tag = encrypted_blob[28:44]
    ciphertext = encrypted_blob[44:]

    key = derive_key(password, salt)

    seed = int.from_bytes(key[:4], 'big') / (2**32)
    sbox = generate_chaotic_sbox(seed)

    inverse_sbox = [0] * 256
    for i, val in enumerate(sbox):
        inverse_sbox[val] = i

    decryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(nonce, tag),
        backend=default_backend()
    ).decryptor()

    decrypted_substituted = decryptor.update(ciphertext) + decryptor.finalize()

    original_data = bytes([inverse_sbox[b] for b in decrypted_substituted])

    return original_data

