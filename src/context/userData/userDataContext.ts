
import { createContext } from 'react';
import { UserDataContextType } from '@/types/UserDataTypes';

// Create the context
export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);
