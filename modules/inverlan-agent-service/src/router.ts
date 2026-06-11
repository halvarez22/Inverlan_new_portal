import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { whatsappRouter } from './webhooks/whatsapp.js';

// Configuración segura de variables de entorno (ISO/IEC 27034)
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Montar submódulos (Separación de Concerns)
app.use('/api/whatsapp', whatsappRouter);

const PORT = process.env.PORT || 3001;

// Endpoint de Healthcheck para monitoreo
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'inverlan-agent-service',
        timestamp: new Date().toISOString()
    });
});

// Endpoint principal para el Portal Web (Recibe mensajes del Chatbot.tsx)
app.post('/api/chat', async (req: Request, res: Response) => {
    const { userId, message } = req.body;
    
    // Validación estricta de inputs (SQA)
    if (!userId || typeof userId !== 'string' || !message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Faltan parámetros requeridos o son inválidos (userId, message)' });
    }

    try {
        import { processAgentChat } from './agent/orchestrator.js';
        
        console.log(`[Web Chat] Procesando mensaje de: ${userId}`);
        const aiResponse = await processAgentChat(userId, message);
        
        res.status(200).json({ 
            reply: aiResponse
        });
    } catch (error) {
        console.error('[Error] /api/chat:', error);
        res.status(500).json({ error: 'Error interno procesando el mensaje' });
    }
});

// Inicio del servicio independiente
app.listen(PORT, () => {
    console.log(`🚀 Inverlan Agent Service corriendo en http://localhost:${PORT}`);
});
