// utils/encryption.ts
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_SECRET!)
  .digest();

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  // Store IV with the encrypted data so we can use it for decryption
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedData: string): string {
  // Split the IV and encrypted data
  const [ivHex, encryptedHex] = encryptedData.split(":");

  // Convert from hex back to buffers
  const iv = Buffer.from(ivHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedHex, "hex");

  // Decrypt
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
