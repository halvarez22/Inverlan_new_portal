import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';

interface CreateUserData {
  email: string;
  password: string;
  username: string;
  role: 'admin' | 'agent' | 'user' | 'referrer';
  name?: string;
}

interface UpdateUserData {
  uid: string;
  email?: string;
  username?: string;
  role?: 'admin' | 'agent' | 'user' | 'referrer';
  name?: string;
}

interface DeleteUserData {
  uid: string;
}

interface CloudFunctionResult {
  success: boolean;
  message?: string;
  uid?: string;
  error?: string;
}

export const userManagementService = {
  async createUser(data: CreateUserData): Promise<CloudFunctionResult> {
    try {
      const createUserFn = httpsCallable<CreateUserData, CloudFunctionResult>(functions, 'createUser');
      const result = await createUserFn(data);
      return result.data;
    } catch (error: unknown) {
      console.error('Error creating user via Cloud Function:', error);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'Unknown error creating user' };
    }
  },

  async updateUser(data: UpdateUserData): Promise<CloudFunctionResult> {
    try {
      const updateUserFn = httpsCallable<UpdateUserData, CloudFunctionResult>(functions, 'updateUser');
      const result = await updateUserFn(data);
      return result.data;
    } catch (error: unknown) {
      console.error('Error updating user via Cloud Function:', error);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'Unknown error updating user' };
    }
  },

  async deleteUser(data: DeleteUserData): Promise<CloudFunctionResult> {
    try {
      const deleteUserFn = httpsCallable<DeleteUserData, CloudFunctionResult>(functions, 'deleteUser');
      const result = await deleteUserFn(data);
      return result.data;
    } catch (error: unknown) {
      console.error('Error deleting user via Cloud Function:', error);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'Unknown error deleting user' };
    }
  },
};
