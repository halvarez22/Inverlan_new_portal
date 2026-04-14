import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function testGemini() {
    console.log("--- Iniciando prueba de Gemini API ---");
    
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("Error: No se encontró el archivo .env.local");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    let apiKey = '';
    for (const line of lines) {
        if (line.startsWith('VITE_GEMINI_API_KEY=')) {
            apiKey = line.split('=')[1].trim();
            break;
        }
    }
    
    if (!apiKey || apiKey === 'tu_clave_api_aqui') {
        console.warn("STATUS: NO CONFIGURADA ⚠️");
        console.warn("La API Key en .env.local es un placeholder o está vacía.");
        return;
    }

    try {
        // Inicializar como lo hace geminiService.ts
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Enviando prompt de prueba...");
        const result = await model.generateContent("Responde solo con la palabra 'OPERATIVA'");
        const response = await result.response;
        const text = response.text().trim();
        
        console.log("Respuesta de Gemini:", text);
        if (text.toUpperCase().includes("OPERATIVA")) {
            console.log("STATUS: OPERATIVA ✅");
        } else {
            console.log("STATUS: ERROR (Respuesta inesperada) ⚠️");
        }
    } catch (error) {
        console.error("STATUS: FALLIDO ❌");
        console.error("Error detallado:", error.message);
        if (error.message.includes("API_KEY_INVALID")) {
            console.error("Causa probable: La API Key proporcionada no es válida.");
        }
    }
}

testGemini();
