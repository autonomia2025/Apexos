import { useCouple } from './useCouple';
import { UserData } from '../types';

export const useActiveUser = (): UserData => {
  const { activeUserId, users } = useCouple();
  return users[activeUserId];
};
