import * as admin from 'firebase-admin';

// Inicialización segura
if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Gestor de Memoria a Largo Plazo
 * SRP: Únicamente lee y escribe el historial de mensajes en Firestore.
 */
export async function getChatHistory(userId: string) {
    try {
        const db = admin.firestore();
        const docRef = db.collection('chat_sessions').doc(userId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            // Si el bot está pausado (hubo hand-off), devolver un flag
            if (data?.botPaused) return { isPaused: true, messages: [] };
            return { isPaused: false, messages: data?.messages || [] };
        }
        return { isPaused: false, messages: [] };
    } catch (error) {
        console.error("Error leyendo memoria:", error);
        return { isPaused: false, messages: [] };
    }
}

export async function saveMessageToHistory(userId: string, role: 'user' | 'model', content: string) {
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
    } catch (error) {
        console.error("Error guardando en memoria:", error);
    }
}
