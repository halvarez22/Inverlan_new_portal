import type { User } from '../../types';

export type StaffAuthMatchInput = {
    firebaseUid: string;
    /** Email ya normalizado a minusculas (desde login o Firebase) */
    emailNormalized: string | null;
    /** Texto del campo login cuando no es correo */
    identifierRaw?: string;
};

/**
 * Resuelve el perfil de negocio para una sesion Firebase.
 * Prioridad: authUid exacto > email > username (identificador sin @).
 */
export function findPortalProfile(users: User[], input: StaffAuthMatchInput): User | undefined {
    const byUid = users.find((u) => u.authUid === input.firebaseUid);
    if (byUid) {
        return byUid;
    }

    if (input.emailNormalized) {
        const byEmail = users.find((u) => u.email?.toLowerCase() === input.emailNormalized);
        if (byEmail) {
            return byEmail;
        }
    }

    const un = input.identifierRaw?.trim().toLowerCase();
    if (un && !input.identifierRaw?.includes('@')) {
        return users.find((u) => u.username.toLowerCase() === un);
    }

    return undefined;
}

/**
 * Campos a persistir en Firestore para alinear perfil con Firebase Auth.
 */
export function buildAuthLinkPatch(
    profile: User,
    firebaseUid: string,
    emailFromAuth: string | null | undefined
): Partial<User> | null {
    const patch: Partial<User> = {};

    if (!profile.authUid || profile.authUid !== firebaseUid) {
        patch.authUid = firebaseUid;
    }

    const em = emailFromAuth?.trim().toLowerCase();
    if (em && (!profile.email || profile.email.toLowerCase() !== em)) {
        patch.email = em;
    }

    return Object.keys(patch).length > 0 ? patch : null;
}
