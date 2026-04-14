/**
 * MCP Resources Definition
 * Resources provide read-only access to data from the model.
 */

import { Property, Client, User } from '../types';

export interface MCPResource<T> {
    uri: string;
    name: string;
    description: string;
    data: () => T;
}

export const createResources = (
    properties: Property[],
    clients: Client[],
    currentUser: User | null
): MCPResource<any>[] => [
    {
        uri: 'mcp://inverland/properties',
        name: 'Listado de Propiedades',
        description: 'Lista completa de propiedades en el inventario con detalles técnicos y estatus.',
        data: () => properties
    },
    {
        uri: 'mcp://inverland/clients',
        name: 'Listado de Clientes',
        description: 'Lista de clientes (leads) en el CRM con estatus y agente asignado.',
        data: () => clients
    },
    {
        uri: 'mcp://inverland/auth/session',
        name: 'Sesión de Usuario',
        description: 'Información del usuario actualmente autenticado y su rol.',
        data: () => currentUser
    }
];
