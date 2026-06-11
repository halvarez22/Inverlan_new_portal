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
exports.requestLeadApproval = requestLeadApproval;
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length)
    admin.initializeApp();
/**
 * Solicitud de Aprobación de Lead Outbound.
 * SRP: Guarda el lead frío y notifica al agente de ventas para su revisión manual.
 * Cumple con la regla operativa de NO contactar automáticamente.
 */
async function requestLeadApproval(leadData) {
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
    }
    catch (error) {
        console.error("Error guardando lead outbound:", error);
        throw new Error("Fallo al registrar el lead capturado en la base de datos.");
    }
}
//# sourceMappingURL=leadApproval.js.map