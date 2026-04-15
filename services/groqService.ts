/**
 * Groq Service
 * Integration with Groq API for high-performance LLM inference.
 * This service replaces Gemini as the primary AI engine for Inverland Portal.
 */

import { PropertyFilters } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_INSTRUCTION = `Eres un asistente virtual de Inverland Portal, una empresa inmobiliaria líder en México. 
Tu objetivo es ayudar a los usuarios a encontrar propiedades, responder sus preguntas sobre financiamiento y guiarlos en el proceso de compra. 
Sé amable, profesional, conciso y responde siempre en español. 
No inventes propiedades, pero puedes hablar sobre los tipos de propiedades que generalmente se ofrecen (casas, departamentos, terrenos) en diversas ubicaciones de México.`;

export const sendMessageToGroq = async (message: string, instruction: string = SYSTEM_INSTRUCTION): Promise<string> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("VITE_GROQ_API_KEY not found. Configure environment variables.");
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: instruction },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("Error communicating with Groq API:", error);
        return "Lo siento, ha ocurrido un error al procesar tu solicitud con Groq. Por favor, inténtalo de nuevo más tarde.";
    }
};

/**
 * Parses a natural language search query into a PropertyFilters object using Groq.
 */
export const parseSearchQueryWithGroq = async (query: string): Promise<Partial<PropertyFilters>> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return {};

    const prompt = `Analiza la siguiente consulta de búsqueda de bienes raíces y extrae los criterios en un formato JSON puro. 
Si un criterio no se menciona, omítelo. 
Campos posibles: 
- type: string (Casa, Departamento, Terreno, Loft, Villa)
- location: string (Ciudad, Estado o Zona)
- minPrice: number
- maxPrice: number
- bedrooms: number
- bathrooms: number
- amenities: string[] (alberca, jardín, gimnasio, etc.)

Consulta: "${query}"
Responde ÚNICAMENTE con el objeto JSON, sin texto adicional.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: "Eres un extractor de datos JSON preciso." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1, // Baja temperatura para mayor precisión en JSON
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const jsonString = data.choices?.[0]?.message?.content || '{}';
        const parsedJson = JSON.parse(jsonString);
        
        const filters: Partial<PropertyFilters> = {};
        if (parsedJson.type) filters.type = parsedJson.type;
        if (parsedJson.location) filters.location = parsedJson.location;
        if (parsedJson.minPrice) filters.minPrice = String(parsedJson.minPrice);
        if (parsedJson.maxPrice) filters.maxPrice = String(parsedJson.maxPrice);
        if (parsedJson.bedrooms) filters.bedrooms = String(parsedJson.bedrooms);
        if (parsedJson.bathrooms) filters.bathrooms = String(parsedJson.bathrooms);
        if (parsedJson.amenities && Array.isArray(parsedJson.amenities)) {
            filters.amenities = parsedJson.amenities;
        }

        return filters;
    } catch (error) {
        console.error("Error parsing search query with Groq:", error);
        return {};
    }
};

/**
 * Translates a given text to the target language using Groq.
 * Used for dynamic content like property descriptions.
 */
export const translateTextWithGroq = async (text: string, targetLanguage: 'es' | 'en' | 'zh'): Promise<string> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || !text || targetLanguage === 'es') return text;

    const languageNames = {
        en: 'Inglés',
        zh: 'Chino (Simplificado)'
    };

    const prompt = `Traduce el siguiente texto de bienes raíces al ${languageNames[targetLanguage]}. 
Mantén el tono profesional y asegúrate de que los términos inmobiliarios sean correctos en el idioma destino. 
Responde ÚNICAMENTE con la traducción, sin texto adicional.

Texto a traducir: "${text}"`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // Usamos un modelo más rápido para traducciones de texto
                messages: [
                    { role: 'system', content: "Eres un traductor profesional experto en bienes raíces." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || text;
    } catch (error) {
        console.error("Error translating text with Groq:", error);
        return text;
    }
};

