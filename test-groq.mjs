import fs from 'fs';
import path from 'path';

async function testGroq() {
    console.log("--- Iniciando prueba de Groq API ---");
    
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("Error: No se encontró el archivo .env.local");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    let apiKey = '';
    for (const line of lines) {
        if (line.startsWith('VITE_GROQ_API_KEY=')) {
            apiKey = line.split('=')[1].trim();
            break;
        }
    }
    
    if (!apiKey || apiKey === 'tu_clave_api_de_groq_aqui') {
        console.warn("STATUS: NO CONFIGURADA ⚠️");
        console.warn("La API Key en .env.local es un placeholder o está vacía.");
        return;
    }

    try {
        console.log("Enviando prompt de prueba a Groq...");
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: "Responde solo con la palabra 'OPERATIVA'" }],
                temperature: 0.1,
                max_tokens: 10
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content?.trim() || '';
        
        console.log("Respuesta de Groq:", text);
        if (text.toUpperCase().includes("OPERATIVA")) {
            console.log("STATUS: OPERATIVA ✅");
        } else {
            console.log("STATUS: ERROR (Respuesta inesperada) ⚠️");
        }
    } catch (error) {
        console.error("STATUS: FALLIDO ❌");
        console.error("Error detallado:", error.message);
    }
}

testGroq();
