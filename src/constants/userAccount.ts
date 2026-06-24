import { UserJourneyStep } from '@/types/user';

type JourneyStep = Record<Uppercase<UserJourneyStep>, UserJourneyStep>;
export const USER_JOURNEY_STEP: JourneyStep = {
  ACCOUNT: 'Account',
  DONE: 'Done',
};
