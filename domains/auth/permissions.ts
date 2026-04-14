import type { User } from '../../types';

export type StaffRole = User['role'];

export function isAdmin(user: User | null | undefined): boolean {
    return user?.role === 'admin';
}

/** Alta / edicion / eliminacion de cuentas de personal y herramientas de diagnostico en usuarios */
export function canManageStaffAccounts(user: User | null | undefined): boolean {
    return isAdmin(user);
}

/** Panel de gestion de usuarios (UI) */
export function canAccessUserManagement(user: User | null | undefined): boolean {
    return isAdmin(user);
}
