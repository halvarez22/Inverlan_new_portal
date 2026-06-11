import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

/**
 * Solicitud de Aprobación de Lead Outbound.
 * SRP: Guarda el lead frío y notifica al agente de ventas para su revisión manual.
 * Cumple con la regla operativa de NO contactar automáticamente.
 */
export async function requestLeadApproval(leadData: {
    author: string;
    platform: string;
    content: string;
    url: string;
    analysis: string;
}) {
    const db = admin.firestore();
    try {
        // 1. Guardar en Firestore como Lead Frío "Pendiente de Aprobación"
        const leadRef = await db.collection('leads_outbound').add({
            ...leadData,
            status: 'pending_human_approval',
            capturedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Alerta al Humano (Simulación de EmailJS / Slack / WhatsApp interno)
        console.log(`\n🚨 [Alerta Outbound] ¡El Agente Cazador capturó un prospecto potencial!`);
        console.log(`➡️ Plataforma: ${leadData.platform} | Autor: ${leadData.author}`);
        console.log(`➡️ Análisis IA: ${leadData.analysis}`);
        console.log(`➡️ Revisa el post original: ${leadData.url}`);
        console.log(`(ID Interno para revisión manual: ${leadRef.id})\n`);

        return {
            success: true,
            message: "Prospecto guardado exitosamente. Se ha notificado al equipo de ventas para su revisión."
        };
    } catch (error) {
        console.error("Error guardando lead outbound:", error);
        throw new Error("Fallo al registrar el lead capturado en la base de datos.");
    }
}
