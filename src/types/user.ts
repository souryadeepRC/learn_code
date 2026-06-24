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
  emailVerified: boolean;
  password: string | null;
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
