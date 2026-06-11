import { Router, Request, Response } from 'express';
import { processAgentChat } from '../agent/orchestrator.js';

export const whatsappRouter = Router();

/**
 * Endpoint GET para la verificación de Meta (Facebook).
 * SRP: Únicamente se encarga de validar el token cuando Meta hace el ping inicial.
 */
whatsappRouter.get('/webhook', (req: Request, res: Response) => {
    const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;
    
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Validación SQA estricta
    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("✅ WHATSAPP WEBHOOK VERIFIED");
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.status(400).send("Faltan parámetros de validación");
});

/**
 * Endpoint POST para recibir mensajes entrantes de clientes.
 * SRP: Extrae el texto y remite al cerebro; no ejecuta lógica de ventas.
 */
whatsappRouter.post('/webhook', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        
        if (body.object) {
            // Estructura de payload oficial de Meta Graph API
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const metadata = body.entry[0].changes[0].value.metadata;
                const msg = body.entry[0].changes[0].value.messages[0];
                
                const from = msg.from; // Número de teléfono del cliente
                const msg_body = msg.text?.body || "";

                console.log(`[WhatsApp] Recibido de: ${from} | Mensaje: ${msg_body}`);
                
                // El número de teléfono actúa como userId para la memoria
                await processAgentChat(from, msg_body);
                // Nota: Aquí se implementaría el dispatch (envío) de vuelta hacia Meta 
                // con la respuesta del LLM. Por el scope del MVP, solo lo procesamos.
            }
            // Meta exige responder HTTP 200 inmediatamente para no reenviar mensajes
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        console.error("❌ Error procesando Webhook de WhatsApp:", error);
        return res.sendStatus(500);
    }
});
