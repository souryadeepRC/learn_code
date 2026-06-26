export type AuthProvider = {};
export type Subsciption = {
  planId: string;
  activatedAt: Date;
  expiresAt: Date;
};
export type UserRole = 'user' | 'admin' | 'instructor';
export type AccountStatus = 'pending_verification' | 'active' | 'deactivated';

export type User = {
  id: string;
  email: string;
  password: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  emailVerified: boolean;
  authProviders: Array<AuthProvider>;
  role: UserRole;
  accountStatus: AccountStatus;
  subscription: Subsciption | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
};
export type NewUser = Pick<User, 'email'> &
  ({ password: string } | { authProviders: User['authProviders'] });

export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export type Address = {
  id: string;
  address1: string;
  address2?: string | null;
  address3?: string | null;
  city: string;
  pincode: string;
  state: string;
  country: string;
  type: AddressType;
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  imageUrl?: string | null;
  phoneNumber?: string | null;
  userId: string;
  technologyIds: string[];
  createdAt: Date;
  updatedAt: Date;
  addresses?: Address[];
};

export type UpdateUserProfilePayload = Partial<
  Pick<
    UserProfile,
    'firstName' | 'lastName' | 'bio' | 'imageUrl' | 'phoneNumber'
  >
>;

export type UserJourneyStep = 'Account' | 'Done';
export type UserInformation = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  imageUrl: string;
  step: UserJourneyStep;
};

export type NewUserInformation = Pick<
  UserInformation,
  'userId' | 'email' | 'username' | 'step'
>;
