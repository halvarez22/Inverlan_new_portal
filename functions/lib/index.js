"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Solo admins pueden llamar estas funciones
const checkAdmin = async (context) => {
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
exports.createUser = functions.https.onCall(async (data, context) => {
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
exports.updateUser = functions.https.onCall(async (data, context) => {
    await checkAdmin(context);
    const { uid, email, username, role, name } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'UID is required');
    }
    const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (email)
        updateData.email = email;
    if (username)
        updateData.username = username;
    if (role)
        updateData.role = role;
    if (name)
        updateData.name = name;
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
exports.deleteUser = functions.https.onCall(async (data, context) => {
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
//# sourceMappingURL=index.js.map