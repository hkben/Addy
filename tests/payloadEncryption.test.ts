/// <reference types="jest" />

import {
  createEncryptionKey,
  decryptPayload,
  encryptPayload,
  unlockEncryptedPayload,
  isPayloadEncrypted,
} from '../src/common/sync/payloadEncryption';

describe('encrypted sync payload', () => {
  const password = 'correct horse battery staple';
  const plaintext = '[{"id":"collection-1"}]';

  it('encrypts, identifies, and decrypts a payload with its stored key', async () => {
    const key = await createEncryptionKey(password);
    const encrypted = await encryptPayload(
      plaintext,
      key.storedKey,
      key.storedSalt
    );

    expect(isPayloadEncrypted(encrypted)).toBe(true);
    expect(encrypted).not.toContain('collection-1');
    await expect(decryptPayload(encrypted, key.storedKey)).resolves.toBe(
      plaintext
    );
  });

  it('unlocks an existing payload with its password', async () => {
    const key = await createEncryptionKey(password);
    const encrypted = await encryptPayload(
      plaintext,
      key.storedKey,
      key.storedSalt
    );

    const unlocked = await unlockEncryptedPayload(encrypted, password);
    expect(unlocked).toEqual(expect.objectContaining({ payload: plaintext }));
    expect(unlocked.storedSalt).toBe(key.storedSalt);
  });

  it('rejects an incorrect password and tampered ciphertext', async () => {
    const key = await createEncryptionKey(password);
    const encrypted = await encryptPayload(
      plaintext,
      key.storedKey,
      key.storedSalt
    );
    const tampered = JSON.parse(encrypted);
    tampered.ciphertext = `${tampered.ciphertext.slice(0, -2)}AA`;

    await expect(unlockEncryptedPayload(encrypted, 'wrong')).rejects.toThrow();
    await expect(
      decryptPayload(JSON.stringify(tampered), key.storedKey)
    ).rejects.toThrow();
  });
});
