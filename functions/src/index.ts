import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

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

// Solo admins pueden llamar estas funciones
const checkAdmin = async (context: functions.https.CallableContext): Promise<boolean> => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
  }

  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  const userData = userDoc.data();

  if (!userData || userData.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can perform this action');
  }

  return true;
};

// Crear usuario
export const createUser = functions.https.onCall(async (data: CreateUserData, context) => {
  await checkAdmin(context);

  const { email, password, username, role, name } = data;

  if (!email || !password || !username || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  // Crear usuario en Firebase Auth
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: username,
  });

  // Crear documento en Firestore
  await db.collection('users').doc(userRecord.uid).set({
    id: userRecord.uid,
    username,
    email,
    role,
    name: name || username,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    uid: userRecord.uid,
    message: 'User created successfully',
  };
});

// Actualizar usuario
export const updateUser = functions.https.onCall(async (data: UpdateUserData, context) => {
  await checkAdmin(context);

  const { uid, email, username, role, name } = data;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required');
  }

  const updateData: Record<string, unknown> = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (email) updateData.email = email;
  if (username) updateData.username = username;
  if (role) updateData.role = role;
  if (name) updateData.name = name;

  // Actualizar en Firestore
  await db.collection('users').doc(uid).update(updateData);

  // Si cambió el email, actualizar en Auth
  if (email) {
    await admin.auth().updateUser(uid, { email });
  }

  return {
    success: true,
    message: 'User updated successfully',
  };
});

// Eliminar usuario
export const deleteUser = functions.https.onCall(async (data: DeleteUserData, context) => {
  await checkAdmin(context);

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required');
  }

  // Eliminar de Firestore
  await db.collection('users').doc(uid).delete();

  // Eliminar de Firebase Auth
  await admin.auth().deleteUser(uid);

  return {
    success: true,
    message: 'User deleted successfully',
  };
});
