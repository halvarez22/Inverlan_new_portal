import { userService as firebaseUserService } from '../../services/firebase/userService';

// Domain-level user service adapter.
// This is the first step to decouple auth/users from the monolithic service file.
export const userService = firebaseUserService;
