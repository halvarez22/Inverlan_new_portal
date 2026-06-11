import dotenv from 'dotenv';

// Carga de variables de entorno
dotenv.config();

/**
 * Validaciones de Seguridad y Configuración (ISO/IEC 27034)
 * Mantiene los secretos fuera del código fuente.
 */
export const config = {
    port: process.env.PORT || 3001,
    geminiApiKey: process.env.GEMINI_API_KEY,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
};

// Validación en tiempo de arranque para evitar caídas silenciosas
if (!config.geminiApiKey) {
    console.warn("⚠️ CRITICAL WARNING: GEMINI_API_KEY no está configurada en .env. El LLM no funcionará.");
}
