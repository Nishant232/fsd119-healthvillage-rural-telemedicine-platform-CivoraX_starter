const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_SECRET)
  .digest();

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

exports.decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
