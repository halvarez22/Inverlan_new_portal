/**
 * MCP Context Provider
 * Orchestrates the exposure of internal application state as MCP Resources and Tools.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from '../components/AuthContext';
import { useProperties } from '../components/PropertyContext';
import { useClients } from '../components/ClientContext';
import { createResources, MCPResource } from './resources';
import { createTools, MCPTool } from './tools';

interface MCPContextType {
    resources: MCPResource<any>[];
    tools: MCPTool[];
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

export const MCPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const { properties, addProperty, updateProperty } = useProperties();
    const { clients, addClient, updateClient } = useClients();

    // Generate Resources (Data)
    const resources = useMemo(() => 
        createResources(properties, clients, currentUser), 
    [properties, clients, currentUser]);

    // Generate Tools (Actions)
    const tools = useMemo(() => 
        createTools(addProperty, updateProperty, addClient, updateClient), 
    [addProperty, updateProperty, addClient, updateClient]);

    // In a real environment, we would also expose these globally so that external agents can find them.
    // e.g. window.__INVERLAND_MCP__ = { resources, tools };
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__INVERLAND_MCP__ = {
                version: '1.0.0',
                resources: resources.map(r => ({ uri: r.uri, name: r.name, description: r.description })),
                tools: tools.map(t => ({ name: t.name, description: t.description, parameters: t.parameters })),
                // Function to get specific data from resource
                readResource: (uri: string) => resources.find(r => r.uri === uri)?.data(),
                // Function to execute tool
                callTool: async (name: string, args: any) => tools.find(t => t.name === name)?.execute(args)
            };
        }
    }, [resources, tools]);

    return (
        <MCPContext.Provider value={{ resources, tools }}>
            {children}
        </MCPContext.Provider>
    );
};

export const useMCP = () => {
    const context = useContext(MCPContext);
    if (context === undefined) {
        throw new Error('useMCP must be used within an MCPProvider');
    }
    return context;
};
