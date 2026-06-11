import { GoogleGenAI } from "@google/genai";
import { getChatHistory, saveMessageToHistory } from "./memory";

/**
 * Bucle Principal de Orquestación del Agente Inverlan.
 * SRP: Recupera memoria, invoca el LLM y guarda la respuesta.
 */
export async function processAgentChat(userId: string, incomingMessage: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "API_KEY_FALTANTE" });
    // 1. Cargar Memoria a Largo Plazo desde Firestore
    const history = await getChatHistory(userId);
    
    // Si el usuario ya fue transferido a un humano, el bot no interfiere.
    if (history.isPaused) {
        return "El asistente automático está pausado. Un asesor de Inverlan se comunicará contigo a la brevedad.";
    }

    // 2. Guardar el nuevo mensaje del usuario en memoria
    await saveMessageToHistory(userId, 'user', incomingMessage);

    // Prompt del Sistema (Guardrails y Personalidad)
    const systemInstruction = `Eres Inverlan Agent, un asistente comercial experto para la inmobiliaria Inverlan en México.
Tu objetivo es perfilar al cliente pacientemente, extraer su presupuesto, zona de interés y días para mudarse.
Usa un tono profesional, amable y empático. Nunca inventes precios o direcciones que no estén en la base de datos.
Si el lead parece muy interesado y proporciona datos de contacto, notifica internamente que es un lead caliente.`;

    try {
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction,
                // Nota: La conexión nativa con las herramientas MCP se inicializa aquí.
                // En un entorno de producción avanzado, usaríamos un cliente MCP para inyectar tools dinámicamente.
            }
        });

        // 3. Invocación del LLM
        // En una implementación real con historial, se pasarían los 'history.messages' a la sesión de chat.
        const response = await chat.sendMessage({ message: incomingMessage });
        const textResponse = response.text || "Disculpa, no logré procesar tu solicitud.";

        // 4. Guardar respuesta del LLM en la memoria
        await saveMessageToHistory(userId, 'model', textResponse);

        return textResponse;
    } catch (error) {
        console.error("❌ Error en Orquestador LLM:", error);
        return "Disculpa, nuestros sistemas están experimentando una ligera demora. Por favor, intenta de nuevo en unos minutos.";
    }
}
