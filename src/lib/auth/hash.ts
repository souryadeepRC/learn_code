import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const RESET_TOKEN_EXPIRY_MINUTES = 30;

export const hashPassword = async (password: string) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateExpiryToken = (
  expiryMin: number = RESET_TOKEN_EXPIRY_MINUTES
) => {
  const expiryToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + expiryMin * 60 * 1000);
  return { expiryToken, expiresAt };
};
