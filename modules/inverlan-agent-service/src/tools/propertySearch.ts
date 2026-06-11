import * as admin from 'firebase-admin';

/**
 * Busca propiedades activas en Firestore basadas en filtros.
 * SRP: Este módulo SOLO se encarga de consultar la colección 'properties'.
 */
export async function searchProperties(filters: {
    type?: string;
    maxPrice?: number;
    location?: string;
}) {
    // Inicialización segura de Firebase Admin (SoC)
    if (!admin.apps.length) {
        admin.initializeApp();
    }

    try {
        const db = admin.firestore();
        let query: admin.firestore.Query = db.collection('properties').where('status', '==', 'active');

        // Aplicación de filtros
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        
        // Limitamos para evitar saturar el token limit del LLM
        query = query.limit(5);

        const snapshot = await query.get();
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filtrado por precio post-query (simplificación para Firestore)
        const filteredResults = filters.maxPrice 
            ? results.filter((p: any) => p.price <= filters.maxPrice!)
            : results;

        return filteredResults;
    } catch (error) {
        console.error("❌ Error en propertySearch:", error);
        throw new Error("Fallo al buscar propiedades en la base de datos.");
    }
}
