import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCODING = 'utf8';
const IV_LENGTH = 12;

export const encryptAnswer = (plaintext: string): string => {
  const key = Buffer.from(process.env.NOTES_ENCRYPTION_KEY || '', 'base64');
  if (key.length !== 32) {
    throw new Error('NOTES_ENCRYPTION_KEY must be a 32-byte base64-encoded key');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, ENCODING, 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  const result = `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  return result;
};

export const decryptAnswer = (stored: string): string => {
  const key = Buffer.from(process.env.NOTES_ENCRYPTION_KEY || '', 'base64');
  if (key.length !== 32) {
    throw new Error('NOTES_ENCRYPTION_KEY must be a 32-byte base64-encoded key');
  }

  const [ivStr, authTagStr, encrypted] = stored.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const authTag = Buffer.from(authTagStr, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', ENCODING);
  decrypted += decipher.final(ENCODING);

  return decrypted;
};
