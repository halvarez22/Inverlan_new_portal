import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { processAgentChat } from './agent/orchestrator';
import { runHunterCycle } from './agent/hunter';

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

// ==========================================
// AGENTE INVERLAN (MICROSERVICIO IA)
// ==========================================

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
    // GET: Verificación de Meta
    if (req.method === 'GET') {
        const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;
        
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode && token) {
            if (mode === "subscribe" && token === verify_token) {
                console.log("✅ WHATSAPP WEBHOOK VERIFIED");
                res.status(200).send(challenge);
                return;
            } else {
                res.sendStatus(403);
                return;
            }
        }
        res.status(400).send("Faltan parámetros de validación");
        return;
    }

    // POST: Recepción de mensajes
    if (req.method === 'POST') {
        try {
            const body = req.body;
            
            if (body.object) {
                if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                    const msg = body.entry[0].changes[0].value.messages[0];
                    const from = msg.from;
                    const msg_body = msg.text?.body || "";

                    console.log(`[WhatsApp] Recibido de: ${from} | Mensaje: ${msg_body}`);
                    
                    await processAgentChat(from, msg_body);
                }
                res.sendStatus(200);
                return;
            } else {
                res.sendStatus(404);
                return;
            }
        } catch (error) {
            console.error("❌ Error procesando Webhook de WhatsApp:", error);
            res.sendStatus(500);
            return;
        }
    }
    
    res.sendStatus(405);
});

// CRON del Agente Cazador (Corre todos los días a las 2 AM)
export const hunterAgent = functions.pubsub.schedule("0 2 * * *").timeZone("America/Mexico_City").onRun(async (context) => {
    await runHunterCycle();
});
