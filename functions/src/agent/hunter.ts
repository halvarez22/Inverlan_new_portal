import Groq from "groq-sdk";
import { searchForLeads } from "../tools/webSearch";
import { requestLeadApproval } from "../tools/leadApproval";

/**
 * Agente Cazador (Outbound Prospecting Loop)
 * SRP: Orquesta la búsqueda en la red, filtra el ruido (triaje) usando Gemini, 
 * y solicita aprobación si el lead es legítimo.
 */
export async function runHunterCycle() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "API_KEY_FALTANTE" });
    console.log("🐺 [Hunter Agent] Iniciando ciclo de rastreo de prospectos en la web...");

    const query = "busco departamento, quiero rentar casa, recomendación inmobiliaria en México";
    const rawResults = await searchForLeads(query);

    // Guardrail para Groq: Identificar intención de compra real y descartar competidores/spam
    const systemInstruction = `Eres Inverlan Hunter, un analista B2C súper estricto.
Se te pasará un texto capturado de redes sociales. Tu trabajo es determinar si la persona está BUSCANDO genuinamente comprar/rentar una propiedad (Lead Válido), o si es otra inmobiliaria haciendo spam/ventas (Ruido).
Responde en formato JSON estricto: { "isValid": boolean, "reason": "tu razonamiento breve" }`;

    for (const result of rawResults) {
        try {
            const prompt = `Analiza este post publicado en ${result.platform}:\n\n"${result.content}"`;
            
            const response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.1
            });

            // Parsear la respuesta JSON de Groq
            const analysisText = response.choices[0]?.message?.content || "{}";
            const analysis = JSON.parse(analysisText);

            if (analysis.isValid) {
                console.log(`✅ [Triaje] Lead legítimo encontrado (${result.author}). Remitiendo a aprobación humana.`);
                // Solo guardamos e informamos (flujo aprobado por usuario)
                await requestLeadApproval({
                    author: result.author,
                    platform: result.platform,
                    content: result.content,
                    url: result.url,
                    analysis: analysis.reason
                });
            } else {
                console.log(`❌ [Triaje] Descartado post de ${result.author}. Razón IA: ${analysis.reason}`);
            }

        } catch (error) {
            console.error("❌ Error en análisis de Gemini durante ciclo Hunter:", error);
        }
    }

    console.log("🐺 [Hunter Agent] Ciclo de rastreo finalizado.");
}
