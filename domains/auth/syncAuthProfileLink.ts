import type { User } from '../../types';
import { userService } from '../users/userService';
import { buildAuthLinkPatch } from './resolveStaffProfile';

/**
 * Persiste authUid y/o email en el documento `users` cuando el perfil esta desalineado con Firebase Auth.
 * Devuelve el perfil fusionado o null si no hubo cambios en Firestore.
 */
export async function syncAuthProfileWithFirebase(
    profile: User,
    firebaseUid: string,
    emailFromAuth: string | null | undefined
): Promise<User | null> {
    const patch = buildAuthLinkPatch(profile, firebaseUid, emailFromAuth);
    if (!patch) {
        return null;
    }
    await userService.updateUser(profile.id, patch);
    return { ...profile, ...patch };
}
