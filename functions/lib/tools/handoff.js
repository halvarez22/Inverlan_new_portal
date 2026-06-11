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
exports.triggerHandoff = triggerHandoff;
const admin = __importStar(require("firebase-admin"));
// Inicialización segura
if (!admin.apps.length)
    admin.initializeApp();
/**
 * Hand-off al equipo de ventas (Transferencia a Humano).
 * SRP: Dispara notificaciones multicanal y registra bitácora. No responde al usuario final.
 */
async function triggerHandoff(args) {
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
    }
    catch (error) {
        console.error("❌ Error en protocolo de Handoff:", error);
        throw new Error("Fallo al ejecutar la transferencia al equipo humano.");
    }
}
//# sourceMappingURL=handoff.js.map