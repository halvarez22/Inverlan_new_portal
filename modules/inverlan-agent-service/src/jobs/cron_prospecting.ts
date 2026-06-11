import { runHunterCycle } from "../agent/hunter.js";

/**
 * Script Automatizado (Cron Job).
 * SRP: Su única responsabilidad es gatillar el ciclo del agente cazador 
 * de manera agnóstica a la infraestructura (crontab local, Firebase Pub/Sub, etc).
 */
async function startJob() {
    console.log(`\n⏰ [Cron] Ejecutando Tarea Programada: Prospección Outbound (${new Date().toISOString()})`);
    
    try {
        await runHunterCycle();
        console.log("⏰ [Cron] Tarea Programada finalizada con éxito.\n");
        process.exit(0);
    } catch (error) {
        console.error("❌ [Cron] Fallo crítico durante la tarea de prospección:", error);
        process.exit(1);
    }
}

// Ejecutar automáticamente si se llama como script directo (ej. node cron_prospecting.js)
startJob();
