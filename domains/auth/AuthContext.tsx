import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import { User, Property, Client } from '../../types';
import { userService } from '../users/userService';
import { auth } from '../../firebase';
import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
    provisionStaffAuthAccount,
    rollbackProvisionedStaffAccount,
    signOutStaffProvisionAuth,
} from '../../services/firebase/staffAuthProvision';
import { findPortalProfile } from './resolveStaffProfile';
import { syncAuthProfileWithFirebase } from './syncAuthProfileLink';
import { canManageStaffAccounts } from './permissions';
import { loggingService } from '../../services/loggingService';
import { domainBridge } from '../../domainBridge';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    users: User[];
    statusMessage: string | null;
    clearStatusMessage: () => void;
    login: (identifier: string, password: string) => Promise<boolean>;
    logout: () => void;
    registerUser: (profile: Omit<User, 'id'>, initialPassword: string) => Promise<void>;
    updateUser: (updatedUser: User) => Promise<void>;
    deleteUser: (userId: string, currentUserName: string, properties: Property[], clients: Client[]) => Promise<void>;
    forceCleanDuplicates: () => Promise<void>;
    diagnoseUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const IS_DEVELOPMENT = window.location.hostname === 'localhost';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const usersRef = useRef<User[]>([]);
    usersRef.current = users;
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        domainBridge.registerAuthDomain({
            getCurrentUser: () => currentUser
        });
    }, [currentUser]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                if (IS_DEVELOPMENT) {
                    console.log('Iniciando carga de usuarios...');
                }

                const syncedUsers = await userService.syncUsers();

                if (syncedUsers.length > 0) {
                    setUsers(syncedUsers);
                    console.log(`Usuarios cargados: ${syncedUsers.length}`);
                } else {
                    if (IS_DEVELOPMENT) {
                        console.log(
                            'Sin usuarios en Firestore. Crea el primer administrador en Firebase Authentication y un documento en la coleccion users con el mismo correo, rol y authUid; o usa una cuenta admin existente para registrar personal.'
                        );
                    } else {
                        console.log('Produccion: lista de usuarios vacia');
                    }
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error en carga de usuarios:', error);
                try {
                    const storedUsers = localStorage.getItem('inverland_users');
                    if (storedUsers) {
                        const parsed = JSON.parse(storedUsers) as Record<string, unknown>[];
                        const localUsers = parsed.map((row) => {
                            const rest = { ...row };
                            delete rest.password;
                            return rest as unknown as User;
                        });
                        setUsers(localUsers);
                        console.log(`Fallback a localStorage: ${localUsers.length} usuarios`);
                    } else {
                        setUsers([]);
                        console.log('Sin usuarios en localStorage');
                    }
                } catch (localError) {
                    console.error('Error accediendo a localStorage:', localError);
                    setUsers([]);
                }
            }
        };

        loadUsers();

        try {
            const sessionUser = sessionStorage.getItem('inverland_session');
            if (sessionUser) {
                const parsed = JSON.parse(sessionUser) as Record<string, unknown>;
                const rest = { ...parsed };
                delete rest.password;
                setCurrentUser(rest as unknown as User);
            }
        } catch (error) {
            console.error('Failed to access session storage:', error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                return;
            }

            void (async () => {
                const matchedUser = findPortalProfile(usersRef.current, {
                    firebaseUid: firebaseUser.uid,
                    emailNormalized: firebaseUser.email?.toLowerCase() ?? null,
                    identifierRaw: undefined,
                });

                if (!matchedUser) {
                    return;
                }

                try {
                    const synced = await syncAuthProfileWithFirebase(
                        matchedUser,
                        firebaseUser.uid,
                        firebaseUser.email
                    );
                    const userToStore = synced ?? { ...matchedUser, authUid: firebaseUser.uid };
                    if (synced) {
                        setUsers((prev) => prev.map((u) => (u.id === synced.id ? synced : u)));
                    }
                    setCurrentUser(userToStore);
                    try {
                        sessionStorage.setItem('inverland_session', JSON.stringify(userToStore));
                    } catch (error) {
                        console.error('Failed to sync session storage:', error);
                    }
                } catch (e) {
                    console.error('onAuthStateChanged profile sync', e);
                }
            })();
        });

        return () => unsubscribe();
    }, []);

    const clearStatusMessage = () => {
        setStatusMessage(null);
    };

    const resolveLoginEmail = (identifier: string): string | null => {
        if (identifier.includes('@')) {
            return identifier.trim().toLowerCase();
        }

        const matchedUser = users.find((u) => u.username.toLowerCase() === identifier.trim().toLowerCase());
        if (matchedUser?.email) {
            return matchedUser.email.toLowerCase();
        }

        return null;
    };

    const login = async (identifier: string, password: string): Promise<boolean> => {
        if (IS_DEVELOPMENT && identifier === 'admin' && password === 'admin') {
            const adminUser: User = {
                id: 'dev-admin-1',
                username: 'admin',
                email: 'admin@inverland.com',
                role: 'admin',
                name: 'Administrador de Desarrollo'
            };
            setCurrentUser(adminUser);
            try {
                sessionStorage.setItem('inverland_session', JSON.stringify(adminUser));
            } catch (error) {
                console.error('Failed to set session storage:', error);
            }
            loggingService.logSecurity('USER_LOGIN', true, adminUser.id, adminUser.role);
            return true;
        }

        const email = resolveLoginEmail(identifier);

        if (email) {
            try {
                const credentials = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUid = credentials.user.uid;
                const matchedUser = findPortalProfile(usersRef.current, {
                    firebaseUid,
                    emailNormalized: email,
                    identifierRaw: identifier,
                });

                if (!matchedUser) {
                    setStatusMessage('Error: El usuario autenticado no tiene perfil en el portal.');
                    return false;
                }

                let userToStore: User = { ...matchedUser, authUid: firebaseUid };
                try {
                    const synced = await syncAuthProfileWithFirebase(
                        matchedUser,
                        firebaseUid,
                        credentials.user.email
                    );
                    if (synced) {
                        userToStore = synced;
                        setUsers((prev) => prev.map((u) => (u.id === synced.id ? synced : u)));
                    }
                } catch (e) {
                    console.error('syncAuthProfileWithFirebase on login', e);
                }

                setCurrentUser(userToStore);
                try {
                    sessionStorage.setItem('inverland_session', JSON.stringify(userToStore));
                } catch (error) {
                    console.error('Failed to set session storage:', error);
                }

                loggingService.logSecurity('USER_LOGIN', true, userToStore.id, userToStore.role);
                return true;
            } catch (error) {
                loggingService.logSecurity('USER_LOGIN_ATTEMPT', false, undefined, undefined, 'Invalid credentials or user error');
                if (error instanceof FirebaseError) {
                    if (
                        error.code === 'auth/invalid-credential' ||
                        error.code === 'auth/wrong-password' ||
                        error.code === 'auth/user-not-found'
                    ) {
                        setStatusMessage('Error: credenciales invalidas.');
                    } else {
                        setStatusMessage('Error: no se pudo iniciar sesion. Intenta de nuevo.');
                    }
                } else {
                    setStatusMessage('Error: no se pudo iniciar sesion.');
                }
                return false;
            }
        }

        if (!email) {
            setStatusMessage(
                'Error: este usuario no tiene correo asociado. Usa tu correo o pide al administrador que actualice tu perfil.'
            );
        }
        return false;
    };

    const logout = () => {
        const userId = currentUser?.id;
        setCurrentUser(null);
        signOut(auth).catch((error) => {
            console.error('Failed to sign out from Firebase:', error);
        });
        try {
            sessionStorage.removeItem('inverland_session');
        } catch (error) {
            console.error('Failed to remove from session storage:', error);
        }
        loggingService.logSecurity('USER_LOGOUT', true, userId);
    };

    const registerUser = async (profile: Omit<User, 'id'>, initialPassword: string) => {
        if (!canManageStaffAccounts(currentUser)) {
            loggingService.logSecurity('USER_REGISTRATION_DENIED', false, currentUser?.id, currentUser?.role, 'Unauthorized user tried to register a staff member');
            setStatusMessage('Error: solo un administrador puede dar de alta usuarios.');
            return;
        }

        if (IS_DEVELOPMENT) {
            console.log('Registrando nuevo usuario:', profile.username);
        }

        const email = profile.email?.trim().toLowerCase();
        if (!email) {
            setStatusMessage('Error: el correo es obligatorio para crear la cuenta en Authentication.');
            return;
        }

        if (users.some((u) => u.username === profile.username)) {
            setStatusMessage(`Error: El usuario '${profile.username}' ya existe.`);
            return;
        }

        if (users.some((u) => u.email?.toLowerCase() === email)) {
            setStatusMessage(`Error: El correo '${email}' ya esta en uso.`);
            return;
        }

        let provisionedUser: FirebaseAuthUser | null = null;
        try {
            const existsInFirebase = await userService.userExistsByUsername(profile.username);
            if (existsInFirebase) {
                setStatusMessage(`Error: El usuario '${profile.username}' ya existe en el sistema.`);
                return;
            }

            const emailTaken = await userService.userExistsByEmail(email);
            if (emailTaken) {
                setStatusMessage(`Error: El correo '${email}' ya esta registrado en el sistema.`);
                return;
            }

            provisionedUser = await provisionStaffAuthAccount(email, initialPassword);
            const userId = await userService.addUser({ ...profile, email, authUid: provisionedUser.uid });
            const userWithId: User = { ...profile, id: userId, email, authUid: provisionedUser.uid };

            setUsers((currentUsers) => {
                const updatedUsers = [...currentUsers, userWithId];
                try {
                    localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                } catch (localError) {
                    console.warn('Failed to save to localStorage backup:', localError);
                }
                return updatedUsers;
            });

            loggingService.logSecurity('STAFF_REGISTRATION_SUCCESS', true, currentUser?.id, currentUser?.role, `Created user: ${userWithId.id}`);
            setStatusMessage(`Exito: Usuario '${profile.username}' creado (Auth + perfil).`);
        } catch (error) {
            loggingService.logSecurity('STAFF_REGISTRATION_FAILURE', false, currentUser?.id, currentUser?.role, `Error during staff registration: ${String(error)}`);
            if (provisionedUser) {
                try {
                    await rollbackProvisionedStaffAccount(provisionedUser);
                } catch (rollbackErr) {
                    console.error(
                        'No se pudo revertir la cuenta de Authentication tras fallo en Firestore:',
                        rollbackErr
                    );
                }
            }
            console.error('Failed to create user:', error);
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/email-already-in-use') {
                    setStatusMessage('Error: ese correo ya existe en Firebase Authentication.');
                    return;
                }
                if (error.code === 'auth/weak-password') {
                    setStatusMessage('Error: la contrasena es demasiado debil.');
                    return;
                }
                if (error.code === 'auth/invalid-email') {
                    setStatusMessage('Error: correo no valido.');
                    return;
                }
            }
            setStatusMessage('Error: No se pudo crear el usuario.');
        } finally {
            await signOutStaffProvisionAuth();
        }
    };

    const updateUser = async (updatedUser: User) => {
        if (!canManageStaffAccounts(currentUser)) {
            loggingService.logSecurity('USER_UPDATE_DENIED', false, currentUser?.id, currentUser?.role, `Unauthorized update attempt for user: ${updatedUser.id}`);
            setStatusMessage('Error: solo un administrador puede editar usuarios del sistema.');
            return;
        }

        try {
            await userService.updateUser(updatedUser.id, updatedUser);

            setUsers((currentUsers) => {
                const updatedUsers = currentUsers.map((u) =>
                    u.id === updatedUser.id ? { ...u, ...updatedUser } : u
                );

                try {
                    localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                } catch (localError) {
                    console.warn('Failed to save to localStorage backup:', localError);
                }

                return updatedUsers;
            });

            loggingService.logSecurity('USER_UPDATE_SUCCESS', true, currentUser?.id, currentUser?.role, `Updated user: ${updatedUser.id}`);
            setStatusMessage(`Exito: Usuario '${updatedUser.username}' actualizado.`);

            if (currentUser && currentUser.id === updatedUser.id) {
                const userToStore = { ...currentUser, ...updatedUser };
                setCurrentUser(userToStore);
                try {
                    sessionStorage.setItem('inverland_session', JSON.stringify(userToStore));
                } catch (error) {
                    console.error('Failed to update session storage:', error);
                }
            }
        } catch (error) {
            loggingService.logSecurity('USER_UPDATE_FAILURE', false, currentUser?.id, currentUser?.role, `Failed to update user: ${updatedUser.id} | ${String(error)}`);
            console.error('Failed to update user in Firebase:', error);
            setStatusMessage('Error: No se pudo actualizar el usuario.');
        }
    };

    const deleteUser = async (
        userId: string,
        currentUserName: string,
        properties: Property[],
        clients: Client[]
    ) => {
        if (!canManageStaffAccounts(currentUser)) {
            loggingService.logSecurity('USER_DELETE_DENIED', false, currentUser?.id, currentUser?.role, `Unauthorized delete attempt for user: ${userId}`);
            setStatusMessage('Error: solo un administrador puede eliminar usuarios.');
            return;
        }

        if (userId === currentUser?.id) {
            setStatusMessage('Error: No puedes eliminar al usuario con el que has iniciado sesion.');
            return;
        }

        const userToDelete = users.find((u) => u.id === userId);
        if (currentUser?.role === 'admin' && userToDelete?.role === 'admin') {
            setStatusMessage('Error: Un administrador no puede eliminar a otro. Primero degrada su rol.');
            return;
        }

        const hasAssignedProperties = properties.some((p) => p.agentId === userId);
        const hasAssignedClients = clients.some((c) => c.assignedAgentId === userId);

        if (hasAssignedProperties || hasAssignedClients) {
            setStatusMessage(
                `Error: No se puede eliminar a '${currentUserName}'. Reasigna sus propiedades y clientes primero.`
            );
            return;
        }

        try {
            await userService.deleteUser(userId);

            setUsers((currentUsers) => {
                const updatedUsers = currentUsers.filter((u) => u.id !== userId);

                try {
                    localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                } catch (localError) {
                    console.warn('Failed to save to localStorage backup:', localError);
                }

                return updatedUsers;
            });

            loggingService.logSecurity('USER_DELETE_SUCCESS', true, currentUser?.id, currentUser?.role, `Deleted user: ${userId}`);
            setStatusMessage(`Exito: Usuario '${currentUserName}' eliminado.`);
        } catch (error) {
            loggingService.logSecurity('USER_DELETE_FAILURE', false, currentUser?.id, currentUser?.role, `Failed to delete user: ${userId} | ${String(error)}`);
            console.error('Failed to delete user in Firebase:', error);
            setStatusMessage('Error: No se pudo eliminar el usuario.');
        }
    };

    const forceCleanDuplicates = async () => {
        if (!canManageStaffAccounts(currentUser)) {
            setStatusMessage('Error: solo un administrador puede ejecutar esta limpieza.');
            return;
        }

        try {
            const result = await userService.forceCleanDuplicates();
            setUsers(result.users);
            setStatusMessage(
                `Limpieza completada: ${result.removed} duplicados eliminados. ${result.users.length} usuarios unicos restantes.`
            );
        } catch (error) {
            console.error('Error en limpieza manual:', error);
            setStatusMessage('Error durante la limpieza de duplicados.');
        }
    };

    const diagnoseUsers = async () => {
        if (!canManageStaffAccounts(currentUser)) {
            setStatusMessage('Error: solo un administrador puede diagnosticar usuarios.');
            return;
        }

        try {
            await userService.diagnoseUsers();
        } catch (error) {
            console.error('Error en diagnostico:', error);
        }
    };

    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated,
                users,
                login,
                logout,
                registerUser,
                updateUser,
                deleteUser,
                forceCleanDuplicates,
                diagnoseUsers,
                statusMessage,
                clearStatusMessage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
