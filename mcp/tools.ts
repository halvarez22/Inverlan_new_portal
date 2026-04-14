/**
 * MCP Tools Definition
 * Tools are functions that the model can call to perform actions.
 */

import { Property, Client } from '../types';

export interface MCPTool {
    name: string;
    description: string;
    parameters: any; // Schema describing required parameters
    execute: (...args: any[]) => Promise<any>;
}

export const createTools = (
    addProperty: (p: Omit<Property, 'id'>) => Promise<void>,
    updateProperty: (p: Property) => Promise<void>,
    addClient: (c: Omit<Client, 'id' | 'createdAt'>) => Promise<void>,
    updateClient: (c: Client) => Promise<void>
): MCPTool[] => [
    {
        name: 'inverland_add_property',
        description: 'Agrega una nueva propiedad al catálogo inmobiliario.',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                price: { type: 'number' },
                location: { type: 'string' },
                type: { type: 'string' }
                // etc...
            },
            required: ['title', 'price', 'location', 'type']
        },
        execute: async (data: any) => addProperty(data)
    },
    {
        name: 'inverland_update_property_stage',
        description: 'Actualiza la etapa del pipeline de una propiedad.',
        parameters: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                pipelineStage: { type: 'string', enum: ['Lead', 'Contactado', 'Visita Agendada', 'Negociación', 'Cerrado'] }
            },
            required: ['id', 'pipelineStage']
        },
        execute: async (data: any) => {
            // Logic to find property and update its stage
            return updateProperty(data as Property);
        }
    },
    {
        name: 'inverland_add_client',
        description: 'Agrega un nuevo cliente (lead) al CRM.',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                status: { type: 'string' }
            },
            required: ['name', 'email', 'status']
        },
        execute: async (data: any) => addClient(data)
    }
];
