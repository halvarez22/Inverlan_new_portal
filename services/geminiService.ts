import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PropertyFilters } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const initializeAi = (): GoogleGenAI => {
    if (!ai) {
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API_KEY not found. The execution environment must provide it.");
            }
            ai = new GoogleGenAI({ apiKey });
        } catch (e) {
            console.error("AI Initialization Error:", e);
            throw new Error("Failed to initialize the AI service: API key is missing or invalid.");
        }
    }
    return ai;
}

const initializeChat = (): Chat => {
    const initializedAi = initializeAi();
    return initializedAi.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `Eres un asistente virtual de Grupo Inverland, una empresa inmobiliaria líder en México. Tu objetivo es ayudar a los usuarios a encontrar propiedades, responder sus preguntas sobre financiamiento y guiarlos en el proceso de compra. Sé amable, profesional, conciso y responde siempre en español. No inventes propiedades, pero puedes hablar sobre los tipos de propiedades que generalmente se ofrecen (casas, departamentos, terrenos) en diversas ubicaciones de México.`,
        },
    });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chat) {
      chat = initializeChat();
    }
    
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key")) {
        return "Error: La clave de API no está configurada correctamente. Por favor, contacta al administrador.";
    }
    return "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";
  }
};

const filterSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, description: "El tipo de propiedad, por ejemplo 'Casa', 'Departamento', 'Terreno', 'Loft', 'Villa'." },
        location: { type: Type.STRING, description: "La ciudad, estado o zona de la búsqueda, por ejemplo 'Ciudad de México', 'Querétaro'." },
        minPrice: { type: Type.NUMBER, description: "El precio mínimo." },
        maxPrice: { type: Type.NUMBER, description: "El precio máximo." },
        bedrooms: { type: Type.NUMBER, description: "El número mínimo de habitaciones." },
        bathrooms: { type: Type.NUMBER, description: "El número mínimo de baños." },
        amenities: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Una lista de amenidades buscadas, como 'alberca', 'jardín', 'gimnasio'."
        }
    },
};

export const parseSearchQuery = async (query: string): Promise<Partial<PropertyFilters>> => {
    const ai = initializeAi();
    const prompt = `Analiza la siguiente consulta de búsqueda de bienes raíces y extrae los criterios en un formato JSON. Si un criterio no se menciona, omítelo del JSON. La consulta es: "${query}"`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: filterSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        // Convert to the format expected by the filters state
        const filters: Partial<PropertyFilters> = {};
        if (parsedJson.type) filters.type = parsedJson.type;
        if (parsedJson.location) filters.location = parsedJson.location;
        if (parsedJson.minPrice) filters.minPrice = String(parsedJson.minPrice);
        if (parsedJson.maxPrice) filters.maxPrice = String(parsedJson.maxPrice);
        if (parsedJson.bedrooms) filters.bedrooms = String(parsedJson.bedrooms);
        if (parsedJson.bathrooms) filters.bathrooms = String(parsedJson.bathrooms);
        if (parsedJson.amenities && parsedJson.amenities.length > 0) {
            filters.amenities = parsedJson.amenities;
        }

        return filters;

    } catch (error) {
        console.error("Error parsing search query with Gemini:", error);
        return {};
    }
};

export const generatePropertyDescription = async (propertyDetails: {
    type: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
}): Promise<string> => {
    const ai = initializeAi();
    const amenitiesText = propertyDetails.amenities.length > 0
        ? `con amenidades clave como: ${propertyDetails.amenities.slice(0, 5).join(', ')}`
        : '';

    const prompt = `
        Actúa como un redactor inmobiliario experto para Grupo Inverland en México.
        Genera una descripción de marketing atractiva y profesional para una propiedad con las siguientes características:
        - Tipo: ${propertyDetails.type}
        - Ubicación: ${propertyDetails.city}, ${propertyDetails.state}
        - Recámaras: ${propertyDetails.bedrooms}
        - Baños: ${propertyDetails.bathrooms}
        ${amenitiesText ? `- Amenidades: ${propertyDetails.amenities.slice(0, 5).join(', ')}` : ''}

        La descripción debe ser en español, resaltar los beneficios clave de la propiedad y su ubicación, usar un tono vendedor pero elegante, y tener una longitud ideal de 2 a 3 párrafos cortos (no exceder las 150 palabras).
        No incluyas el precio. Comienza directamente con la descripción.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating property description with Gemini:", error);
        return "No se pudo generar la descripción. Por favor, inténtelo de nuevo.";
    }
};

export const generateCampaignBody = async (userPrompt: string): Promise<string> => {
    const ai = initializeAi();
    const prompt = `
        Actúa como un experto en marketing inmobiliario para Grupo Inverland en México.
        Basado en la siguiente instrucción, genera el cuerpo de un correo electrónico de marketing en formato HTML.

        Instrucción del usuario: "${userPrompt}"

        Requisitos:
        - El tono debe ser profesional, atractivo y persuasivo.
        - Utiliza el placeholder {{client_name}} para el saludo inicial. Por ejemplo: "Estimado/a {{client_name}},".
        - Estructura el correo en párrafos cortos y fáciles de leer.
        - Incluye un llamado a la acción claro al final (ej. "Contáctanos", "Agenda una visita").
        - El resultado debe ser solo el código HTML del cuerpo del correo, sin incluir etiquetas <html>, <head>, o <body>. Puedes usar etiquetas como <p>, <strong>, <ul>, <li>, <a>.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating campaign body with Gemini:", error);
        return "<p>No se pudo generar el contenido. Por favor, inténtelo de nuevo.</p>";
    }
};