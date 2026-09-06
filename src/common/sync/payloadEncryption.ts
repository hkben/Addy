import log from 'loglevel';

export interface EncryptedPayload {
  version: 1;
  kdf: {
    name: 'PBKDF2-SHA-256';
    iterations: number;
    salt: string;
  };
  cipher: {
    name: 'AES-256-GCM';
    iv: string;
  };
  ciphertext: string;
}

export interface EncryptedPayloadResult {
  payload: string;
  storedKey: string;
  storedSalt: string;
}

const PBKDF2_ITERATIONS = 600000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const base64ToBytes = (value: string): ArrayBuffer => {
  const binary = atob(value);

  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
};

const getDeriveKey = async (password: string, salt: ArrayBuffer) => {
  if (!password) {
    throw new Error('A sync encryption password is required');
  }

  const textEncoder = new TextEncoder();
  var key = textEncoder.encode(password);

  // Convert the password into a CryptoKey that can be used for key derivation
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    key,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Use the password key and salt to derive the AES-GCM encryption key
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: PBKDF2_ITERATIONS,
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
};

const exportStoredKey = async (key: CryptoKey) => {
  return bytesToBase64(
    new Uint8Array(await crypto.subtle.exportKey('raw', key))
  );
};

const importStoredKey = (storedKey: string) => {
  return crypto.subtle.importKey(
    'raw',
    base64ToBytes(storedKey),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const parsePayload = (payload: string) => {
  const parsed = JSON.parse(payload) as EncryptedPayload;

  if (
    parsed == null ||
    typeof parsed !== 'object' ||
    typeof parsed.ciphertext !== 'string' ||
    parsed.cipher == null
  ) {
    throw new Error('Unsupported encrypted sync payload');
  }

  return parsed;
};

export const isPayloadEncrypted = (payload: string) => {
  try {
    parsePayload(payload);
    return true;
  } catch (error) {
    return false;
  }
};

export const createEncryptionKey = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await getDeriveKey(password, salt.buffer);

  var storedKey = await exportStoredKey(key);
  var storedSalt = bytesToBase64(salt as Uint8Array);

  return { storedKey, storedSalt };
};

export const encryptPayload = async (
  plaintext: string,
  storedKey: string,
  storedSalt: string
) => {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await importStoredKey(storedKey),
    data
  );

  var payload: EncryptedPayload = {
    version: 1,
    kdf: {
      name: 'PBKDF2-SHA-256',
      iterations: PBKDF2_ITERATIONS,
      salt: storedSalt,
    },
    cipher: {
      name: 'AES-256-GCM',
      iv: bytesToBase64(iv),
    },
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  };

  return JSON.stringify(payload);
};

export const decryptPayload = async (payload: string, storedKey: string) => {
  const textDecoder = new TextDecoder();
  const envelope = parsePayload(payload);

  const plaintext = await crypto.subtle
    .decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(envelope.cipher.iv) },
      await importStoredKey(storedKey),
      base64ToBytes(envelope.ciphertext)
    )
    .catch((error) => {
      log.error('[Sync] Error decrypting payload:', error);
      throw Error('Failed to decrypt remote file (Maybe wrong password)');
    });

  return textDecoder.decode(plaintext);
};

export const unlockEncryptedPayload = async (
  payload: string,
  password: string
) => {
  log.debug('[Sync] Unlocking encrypted payload with provided password.');

  const textDecoder = new TextDecoder();

  const envelope = parsePayload(payload);

  const key = await getDeriveKey(password, base64ToBytes(envelope.kdf.salt));

  const plaintext = await crypto.subtle
    .decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(envelope.cipher.iv) },
      key,
      base64ToBytes(envelope.ciphertext)
    )
    .catch((error) => {
      log.error('[Sync] Error decrypting payload:', error);
      throw Error('Failed to decrypt remote file (Maybe wrong password)');
    });

  log.debug('[Sync] Successfully decrypted payload.');

  return {
    payload: textDecoder.decode(plaintext),
    storedKey: await exportStoredKey(key),
    storedSalt: envelope.kdf.salt,
  };
};
