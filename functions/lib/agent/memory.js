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
exports.getChatHistory = getChatHistory;
exports.saveMessageToHistory = saveMessageToHistory;
const admin = __importStar(require("firebase-admin"));
// Inicialización segura
if (!admin.apps.length) {
    admin.initializeApp();
}
/**
 * Gestor de Memoria a Largo Plazo
 * SRP: Únicamente lee y escribe el historial de mensajes en Firestore.
 */
async function getChatHistory(userId) {
    try {
        const db = admin.firestore();
        const docRef = db.collection('chat_sessions').doc(userId);
        const doc = await docRef.get();
        if (doc.exists) {
            const data = doc.data();
            // Si el bot está pausado (hubo hand-off), devolver un flag
            if (data?.botPaused)
                return { isPaused: true, messages: [] };
            return { isPaused: false, messages: data?.messages || [] };
        }
        return { isPaused: false, messages: [] };
    }
    catch (error) {
        console.error("Error leyendo memoria:", error);
        return { isPaused: false, messages: [] };
    }
}
async function saveMessageToHistory(userId, role, content) {
    try {
        const db = admin.firestore();
        const docRef = db.collection('chat_sessions').doc(userId);
        await docRef.set({
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            messages: admin.firestore.FieldValue.arrayUnion({
                role,
                content,
                timestamp: new Date().toISOString()
            })
        }, { merge: true });
    }
    catch (error) {
        console.error("Error guardando en memoria:", error);
    }
}
//# sourceMappingURL=memory.js.map