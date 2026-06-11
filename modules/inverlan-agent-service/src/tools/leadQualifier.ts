/**
 * Algoritmo de Scoring Dinámico para el Agente Inverlan.
 * SRP: Únicamente calcula la probabilidad de cierre del prospecto (Lead Score).
 */
export function calculateLeadScore(lead: {
    hasBudget?: boolean;
    moveInTimeframeDays?: number;
    hasApprovedCredit?: boolean;
    providedPhone?: boolean;
}): number {
    let score = 0;

    // Puntos por calidad de contacto y perfil
    if (lead.providedPhone) score += 30; // El teléfono es crítico para el cierre
    if (lead.hasBudget) score += 20;
    if (lead.hasApprovedCredit) score += 30; // Lead de alta probabilidad
    
    // Puntos por urgencia (mientras más pronto, más caliente el lead)
    if (lead.moveInTimeframeDays !== undefined) {
        if (lead.moveInTimeframeDays <= 30) {
            score += 20;
        } else if (lead.moveInTimeframeDays <= 90) {
            score += 10;
        }
    }

    // Aseguramos que el score no exceda el límite lógico de 100
    return Math.min(score, 100);
}
