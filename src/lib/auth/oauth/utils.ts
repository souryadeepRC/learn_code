import { prismaUsers } from '@/lib/prismaUsers';
/**
 * Generate a pseudo-email when provider doesn't return email
 * Examples:
 * - github_12345@auth.local
 * - facebook_67890@auth.local
 * - linkedin_username@auth.local
 */
export const generatePseudoEmail = (
  provider: string,
  providerAccountId: string | number
): string => {
  // Option 1: Use provider + ID
  return `${provider}_${providerAccountId}@auth.local`;

  // Option 2: Use provider + sanitized name
  // if (name) {
  //   const sanitized = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  //   return `${provider}_${sanitized}@auth.local`;
  // }
  // return `${provider}_${providerAccountId}@auth.local`;
};

/**
 * Check if email is a pseudo-email
 */
export const isPseudoEmail = (email: string | null | undefined): boolean => {
  return email?.endsWith('@auth.local') ?? false;
};

/**
 * Extract provider from pseudo-email
 */
export const getProviderFromPseudoEmail = (email: string): string | null => {
  const match = email.match(/^(\w+)_.*@auth\.local$/);
  return match ? match[1] : null;
};

/**
 * Safely find user by email (handles both real and pseudo-emails)
 */
export const findUserByEmailOrId = async (
  identifier: string | null | undefined
): Promise<unknown> => {
  if (!identifier) return null;

  // Try exact email match
  const userByEmail = await prismaUsers.user.findUnique({
    where: { email: identifier },
  });

  if (userByEmail) return userByEmail;

  // If not found and is pseudo-email, try to find by provider
  if (isPseudoEmail(identifier)) {
    const provider = getProviderFromPseudoEmail(identifier);
    if (provider) {
      // Find user with account from this provider
      const account = await prismaUsers.account.findFirst({
        where: { provider },
        include: { user: true },
      });
      return account?.user || null;
    }
  }

  return null;
};
