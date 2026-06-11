"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProperties = searchProperties;
const admin = __importStar(require("firebase-admin"));
/**
 * Busca propiedades activas en Firestore basadas en filtros.
 * SRP: Este módulo SOLO se encarga de consultar la colección 'properties'.
 */
async function searchProperties(filters) {
    // Inicialización segura de Firebase Admin (SoC)
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    try {
        const db = admin.firestore();
        let query = db.collection('properties').where('status', '==', 'active');
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
            ? results.filter((p) => p.price <= filters.maxPrice)
            : results;
        return filteredResults;
    }
    catch (error) {
        console.error("❌ Error en propertySearch:", error);
        throw new Error("Fallo al buscar propiedades en la base de datos.");
    }
}
//# sourceMappingURL=propertySearch.js.map