import { createUserWithEmailAndPassword, deleteUser, signOut, type User as FirebaseUser } from "firebase/auth";
import { secondaryAuth } from "../../firebase";

/**
 * Crea la cuenta en Firebase Auth usando una instancia secundaria, para no cambiar
 * la sesión del administrador en `auth` principal.
 */
export async function provisionStaffAuthAccount(email: string, password: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  return cred.user;
}

export async function rollbackProvisionedStaffAccount(user: FirebaseUser): Promise<void> {
  await deleteUser(user);
}

export async function signOutStaffProvisionAuth(): Promise<void> {
  await signOut(secondaryAuth);
}
