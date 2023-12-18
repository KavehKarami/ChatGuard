export async function encrypt(
  message: string,
  secretKey: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // Generate an encryption key
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  // Generate an IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    data
  );

  // Combine the IV and the encrypted data
  const encryptedMessage = new Uint8Array(iv.length + encryptedData.byteLength);
  encryptedMessage.set(iv);
  encryptedMessage.set(new Uint8Array(encryptedData), iv.length);

  return Array.from(encryptedMessage)
    .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
    .join("");
}

export async function decrypt(
  encryptedMessage: string,
  secretKey: string
): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  const encryptedData = new Uint8Array(
    encryptedMessage.match(/[\da-f]{2}/gi)!.map((hex) => parseInt(hex, 16))
  );

  // Extract the IV from the encrypted message
  const iv = encryptedData.slice(0, 16);

  // Generate a decryption key
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  // Decrypt the data
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedData.slice(16)
  );

  return decoder.decode(decryptedData);
}
