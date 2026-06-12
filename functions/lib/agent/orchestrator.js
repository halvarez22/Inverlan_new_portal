"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAgentChat = processAgentChat;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const memory_1 = require("./memory");
/**
 * Bucle Principal de Orquestación del Agente Inverlan.
 * SRP: Recupera memoria, invoca el LLM y guarda la respuesta.
 */
async function processAgentChat(userId, incomingMessage) {
    const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY || "API_KEY_FALTANTE" });
    // 1. Cargar Memoria a Largo Plazo desde Firestore
    const history = await (0, memory_1.getChatHistory)(userId);
    // Si el usuario ya fue transferido a un humano, el bot no interfiere.
    if (history.isPaused) {
        return "El asistente automático está pausado. Un asesor de Inverlan se comunicará contigo a la brevedad.";
    }
    // 2. Guardar el nuevo mensaje del usuario en memoria
    await (0, memory_1.saveMessageToHistory)(userId, 'user', incomingMessage);
    // Prompt del Sistema (Guardrails y Personalidad)
    const systemInstruction = `Eres Inverlan Agent, un asistente comercial experto para la inmobiliaria Inverlan en México.
Tu objetivo es perfilar al cliente pacientemente, extraer su presupuesto, zona de interés y días para mudarse.
Usa un tono profesional, amable y empático. Nunca inventes precios o direcciones que no estén en la base de datos.
Si el lead parece muy interesado y proporciona datos de contacto, notifica internamente que es un lead caliente.`;
    try {
        const groqMessages = [
            { role: "system", content: systemInstruction },
            // Mapear historial al formato de Groq (OpenAI style)
            ...history.messages.map((m) => ({
                role: (m.role === 'model' ? 'assistant' : 'user'),
                content: m.content
            })),
            { role: "user", content: incomingMessage }
        ];
        // 3. Invocación del LLM
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.7
        });
        const textResponse = response.choices[0]?.message?.content || "Disculpa, no logré procesar tu solicitud.";
        // 4. Guardar respuesta del LLM en la memoria
        await (0, memory_1.saveMessageToHistory)(userId, 'model', textResponse);
        return textResponse;
    }
    catch (error) {
        console.error("❌ Error en Orquestador LLM:", error);
        return "Disculpa, nuestros sistemas están experimentando una ligera demora. Por favor, intenta de nuevo en unos minutos.";
    }
}
//# sourceMappingURL=orchestrator.js.map