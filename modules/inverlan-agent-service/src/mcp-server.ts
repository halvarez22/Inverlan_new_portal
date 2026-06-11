import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchProperties } from "./tools/propertySearch.js";
import { calculateLeadScore } from "./tools/leadQualifier.js";

// Inicialización del Servidor MCP para asegurar interoperabilidad (AGENTS.md)
const server = new McpServer({
  name: "InverlanAgentServer",
  version: "1.0.0"
});

// Registro de Herramienta: Búsqueda de Propiedades
server.tool(
  "search_properties",
  "Busca propiedades activas en la base de datos de Inverlan basadas en presupuesto, tipo y ubicación.",
  {
    type: z.string().optional().describe("Tipo de propiedad (ej. 'Casa', 'Departamento')"),
    maxPrice: z.number().optional().describe("Presupuesto máximo del prospecto"),
    location: z.string().optional().describe("Zona o ubicación de interés")
  },
  async (args) => {
    const results = await searchProperties(args);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
    };
  }
);

// Registro de Herramienta: Calificación de Lead
server.tool(
  "calculate_lead_score",
  "Calcula el puntaje del lead basado en sus respuestas para determinar urgencia y perfilamiento.",
  {
    hasBudget: z.boolean().optional(),
    moveInTimeframeDays: z.number().optional(),
    hasApprovedCredit: z.boolean().optional(),
    providedPhone: z.boolean().optional()
  },
  async (args) => {
    const score = calculateLeadScore(args);
    return {
      content: [{ type: "text", text: `Lead Score Calculado: ${score}/100 puntos.` }]
    };
  }
);

import { scheduleAppointment } from "./tools/calendar.js";
import { triggerHandoff } from "./tools/handoff.js";

// Registro de Herramienta: Agendamiento de Citas
server.tool(
  "schedule_appointment",
  "Agenda una cita en Google Calendar (inverlandnet@gmail.com) para un cliente.",
  {
    clientName: z.string().describe("Nombre del cliente"),
    date: z.string().describe("Fecha en formato YYYY-MM-DD"),
    time: z.string().describe("Hora en formato HH:MM"),
    propertyInterest: z.string().optional().describe("Propiedad de interés")
  },
  async (args) => {
    const result = await scheduleAppointment(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

// Registro de Herramienta: Handoff a Humano
server.tool(
  "trigger_handoff",
  "Transfiere el control a un humano cuando el lead es calificado (Lead Score alto). Notifica vía Email y WhatsApp.",
  {
    userId: z.string().describe("ID del usuario en el chat"),
    clientName: z.string().describe("Nombre del cliente"),
    clientPhone: z.string().optional().describe("Teléfono del cliente"),
    clientEmail: z.string().optional().describe("Correo del cliente"),
    leadScore: z.number().describe("Lead score calculado (0-100)"),
    executiveSummary: z.string().describe("Brief generado por IA sobre el cliente")
  },
  async (args) => {
    const result = await triggerHandoff(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

import { searchForLeads } from "./tools/webSearch.js";

// Registro de Herramienta: Búsqueda Web (Prospección Outbound)
server.tool(
  "search_for_leads",
  "Busca en internet (redes sociales, foros) posibles prospectos basados en una consulta (query).",
  {
    query: z.string().describe("Palabras clave de la búsqueda (ej. 'busco departamento en venta')")
  },
  async (args) => {
    const results = await searchForLeads(args.query);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
    };
  }
);

// Arrancar el transporte Stdio
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("✅ Inverlan MCP Server corriendo y escuchando herramientas.");
  } catch (error) {
    console.error("❌ Error arrancando el servidor MCP:", error);
  }
}

startServer();
