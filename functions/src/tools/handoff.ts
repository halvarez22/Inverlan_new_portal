import * as admin from 'firebase-admin';

// Inicialización segura
if (!admin.apps.length) admin.initializeApp();

/**
 * Hand-off al equipo de ventas (Transferencia a Humano).
 * SRP: Dispara notificaciones multicanal y registra bitácora. No responde al usuario final.
 */
export async function triggerHandoff(args: {
    userId: string;
    clientName: string;
    clientPhone?: string;
    clientEmail?: string;
    leadScore: number;
    executiveSummary: string; // Brief generado por la IA
}) {
    const db = admin.firestore();

    try {
        // 1. Bitácora Interna (Trazabilidad estricta)
        await db.collection('handoff_logs').add({
            userId: args.userId,
            clientName: args.clientName,
            clientPhone: args.clientPhone || "No provisto",
            clientEmail: args.clientEmail || "No provisto",
            leadScore: args.leadScore,
            summary: args.executiveSummary,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'transferred_to_human'
        });

        // 2. Notificación EmailJS (Simulación del dispatch al servicio actual)
        console.log(`📧 [EmailJS Dispatch] Enviando Brief de ${args.clientName} al correo de ventas de Inverlan.`);
        
        // 3. Notificación WhatsApp al asesor (Simulación de mensaje saliente por Meta API)
        console.log(`📱 [WhatsApp Outbound] ¡Nuevo Lead Caliente (${args.leadScore} pts)!`);
        console.log(`Nombre: ${args.clientName} | Teléfono: ${args.clientPhone || "Pendiente"}`);
        console.log(`Brief: ${args.executiveSummary}`);

        // 4. Pausar el agente automático para esta sesión (para que no interrumpa al humano)
        await db.collection('chat_sessions').doc(args.userId).set({ botPaused: true }, { merge: true });

        return {
            success: true,
            message: "El equipo humano ha sido notificado exitosamente. El agente automático se pausará para esta conversación."
        };
    } catch (error) {
        console.error("❌ Error en protocolo de Handoff:", error);
        throw new Error("Fallo al ejecutar la transferencia al equipo humano.");
    }
}
