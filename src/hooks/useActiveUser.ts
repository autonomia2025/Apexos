import { useCouple } from './useCouple';
import { UserData } from '../types';

export const useActiveUser = (): UserData => {
  const { activeRole, users } = useCouple();
  return users[activeRole];
};
