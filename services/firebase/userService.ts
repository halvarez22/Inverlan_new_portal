import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { User } from '../../types';

const USERS_COLLECTION = 'users';

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

/** Nunca persistir ni exponer contraseñas; limpia legado en lectura. */
const omitPassword = <T extends Record<string, unknown>>(data: T): T => {
  const rest = { ...data };
  delete rest.password;
  return rest as T;
};

const sanitizeWrite = (user: Record<string, unknown>): Record<string, unknown> =>
  omitPassword(
    Object.fromEntries(Object.entries(user).filter(([_, value]) => value !== undefined))
  );

const deleteUserDirectly = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const getAllUsersDirectly = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const allUsers = querySnapshot.docs.map(doc =>
      omitPassword({ id: doc.id, ...doc.data() } as Record<string, unknown>)
    ) as unknown as User[];

    const uniqueUsers = new Map<string, User>();
    for (const user of allUsers) {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, user);
      }
    }

    const result = Array.from(uniqueUsers.values());
    if (result.length !== allUsers.length) {
      console.warn(`Firebase devolvió ${allUsers.length} documentos, ${result.length} únicos por id`);
    }

    return result;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

const addUserDirectly = async (user: Omit<User, 'id'>): Promise<string> => {
  try {
    const cleanUser = sanitizeWrite({ ...user });

    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...cleanUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, USERS_COLLECTION));
      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map(doc =>
        omitPassword({ id: doc.id, ...doc.data() } as Record<string, unknown>)
      ) as unknown as User[];

      console.log(`[userService] Raw users from Firestore: ${allUsers.length}`);
      
      const uniqueUsers = new Map<string, User>();
      for (const user of allUsers) {
        if (!uniqueUsers.has(user.id)) {
          uniqueUsers.set(user.id, user);
        }
      }

      const result = Array.from(uniqueUsers.values());
      return result;
    } catch (error) {

      console.error('Error getting users:', error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return omitPassword({
          id: docSnap.id,
          ...docSnap.data()
        } as Record<string, unknown>) as unknown as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async addUser(user: Omit<User, 'id'>): Promise<string> {
    try {
      const cleanUser = sanitizeWrite({ ...user });

      const docRef = await addDoc(collection(db, USERS_COLLECTION), {
        ...cleanUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    try {
      const cleanUser = sanitizeWrite({ ...user });

      const docRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(docRef, {
        ...cleanUser,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async userExistsByUsername(username: string): Promise<boolean> {
    try {
      const q = query(collection(db, USERS_COLLECTION));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.some(doc => doc.data().username === username);
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  },

  async userExistsByEmail(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    try {
      const q = query(collection(db, USERS_COLLECTION), where('email', '==', normalized));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.warn('Email query fallback (scan):', error);
      try {
        const q = query(collection(db, USERS_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.some(
          (d) => String(d.data().email || '').toLowerCase() === normalized
        );
      } catch (e2) {
        console.error('Error checking if email exists:', e2);
        return false;
      }
    }
  },

  async syncUsers(): Promise<User[]> {
    try {
      devLog('Iniciando sincronización de usuarios...');

      const duplicatesRemoved = await userService.cleanDuplicateUsers();
      if (duplicatesRemoved > 0) {
        devLog(`Duplicados eliminados de Firebase: ${duplicatesRemoved}`);
      }

      const firebaseUsers = await getAllUsersDirectly();

      let localUsers: User[] = [];
      try {
        const storedUsers = localStorage.getItem('inverland_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers) as User[];
          localUsers = parsed.map((u) => omitPassword({ ...u } as Record<string, unknown>) as unknown as User);
        }
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
      }

      const firebaseUsersMap = new Map(firebaseUsers.map(user => [user.username, user]));
      const newLocalUsers = localUsers.filter(localUser => !firebaseUsersMap.has(localUser.username));

      const syncedUsers = [...firebaseUsers];
      for (const localUser of newLocalUsers) {
        try {
          const userId = await addUserDirectly(localUser);
          syncedUsers.push({ ...localUser, id: userId });
          devLog('Usuario sincronizado desde localStorage a Firebase');
        } catch (error) {
          console.warn('Error sincronizando un usuario desde localStorage:', error);
        }
      }

      try {
        localStorage.setItem('inverland_users', JSON.stringify(syncedUsers));
      } catch (error) {
        console.warn('Error updating localStorage:', error);
      }

      devLog(`Sincronización completada: ${syncedUsers.length} usuarios`);
      return syncedUsers;
    } catch (error) {
      console.error('Error syncing users:', error);
      throw error;
    }
  },

  async cleanDuplicateUsers(): Promise<number> {
    try {
      const allUsers = await getAllUsersDirectly();
      const uniqueUsers = new Map<string, User>();
      let duplicatesRemoved = 0;

      for (const user of allUsers) {
        if (!uniqueUsers.has(user.username)) {
          uniqueUsers.set(user.username, user);
        } else {
          try {
            await deleteUserDirectly(user.id);
            duplicatesRemoved++;
            devLog('Duplicado eliminado en Firebase');
          } catch (error) {
            console.warn('Error eliminando duplicado en Firebase:', error);
          }
        }
      }

      const cleanedUsers = Array.from(uniqueUsers.values());
      try {
        localStorage.setItem('inverland_users', JSON.stringify(cleanedUsers));
      } catch (error) {
        console.warn('Error updating localStorage after cleanup:', error);
      }

      devLog(`Limpieza completada: ${duplicatesRemoved} duplicados eliminados`);
      return duplicatesRemoved;
    } catch (error) {
      console.error('Error cleaning duplicate users:', error);
      throw error;
    }
  },

  async diagnoseUsers(): Promise<void> {
    try {
      const allUsers = await getAllUsersDirectly();
      devLog('Diagnóstico de usuarios');
      devLog(`Total de usuarios: ${allUsers.length}`);

      const uniqueIds = new Set<string>();
      const duplicateIds: string[] = [];

      for (const user of allUsers) {
        if (uniqueIds.has(user.id)) {
          duplicateIds.push(user.id);
        } else {
          uniqueIds.add(user.id);
        }
      }

      if (duplicateIds.length > 0) {
        devLog(`Problema: IDs duplicados en consulta (recuento: ${duplicateIds.length})`);
      }

      const usersByUsername = new Map<string, User[]>();
      for (const user of allUsers) {
        if (!usersByUsername.has(user.username)) {
          usersByUsername.set(user.username, []);
        }
        usersByUsername.get(user.username)!.push(user);
      }

      for (const [, users] of usersByUsername) {
        if (users.length > 1) {
          devLog(`Duplicado por username: ${users.length} copias`);
          users.forEach((user, index) => {
            devLog(`  ${index + 1}. id=${user.id}, rol=${user.role}`);
          });
        } else {
          devLog(`Único: id=${users[0].id}`);
        }
      }
    } catch (error) {
      console.error('Error in diagnose users:', error);
    }
  },

  async forceCleanDuplicates(): Promise<{ removed: number, users: User[] }> {
    try {
      devLog('Iniciando limpieza forzada de duplicados...');
      const allUsers = await getAllUsersDirectly();
      devLog(`Total de usuarios encontrados: ${allUsers.length}`);

      const uniqueUsers = new Map<string, User>();
      const duplicatesToRemove: User[] = [];

      for (const user of allUsers) {
        if (!uniqueUsers.has(user.id)) {
          uniqueUsers.set(user.id, user);
        } else {
          duplicatesToRemove.push(user);
          devLog(`ID duplicado en consulta: ${user.id}`);
        }
      }

      devLog(`Duplicados por ID encontrados: ${duplicatesToRemove.length}`);

      if (duplicatesToRemove.length > 0) {
        devLog('Hay documentos con ID duplicado en el resultado; filtrando a IDs únicos');

        const cleanedUsers = Array.from(uniqueUsers.values());
        try {
          localStorage.setItem('inverland_users', JSON.stringify(cleanedUsers));
          devLog('localStorage actualizado');
        } catch (error) {
          console.warn('Error updating localStorage:', error);
        }

        devLog(`Limpieza por ID: ${duplicatesToRemove.length} entradas duplicadas descartadas`);
        devLog(`Usuarios únicos restantes: ${cleanedUsers.length}`);
        return { removed: duplicatesToRemove.length, users: cleanedUsers };
      }

      const usersByUsername = new Map<string, User>();
      const usernameDuplicates: User[] = [];

      for (const user of allUsers) {
        if (!usersByUsername.has(user.username)) {
          usersByUsername.set(user.username, user);
        } else {
          usernameDuplicates.push(user);
        }
      }

      devLog(`Duplicados por username encontrados: ${usernameDuplicates.length}`);

      for (const duplicate of usernameDuplicates) {
        try {
          await deleteUserDirectly(duplicate.id);
          devLog(`Eliminado documento duplicado: ${duplicate.id}`);
        } catch (error) {
          console.warn('Error eliminando duplicado por username:', error);
        }
      }

      const cleanedUsers = await getAllUsersDirectly();
      try {
        localStorage.setItem('inverland_users', JSON.stringify(cleanedUsers));
        devLog('localStorage actualizado');
      } catch (error) {
        console.warn('Error updating localStorage:', error);
      }

      devLog(`Limpieza forzada completada: ${usernameDuplicates.length} duplicados eliminados`);
      devLog(`Usuarios únicos restantes: ${cleanedUsers.length}`);

      return { removed: usernameDuplicates.length, users: cleanedUsers };
    } catch (error) {
      console.error('Error in force clean duplicates:', error);
      throw error;
    }
  }
};
