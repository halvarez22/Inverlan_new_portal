import React, { createContext, useContext, ReactNode } from 'react';
import { Client, ClientActivityLog } from '../types';
import { useClientState } from '../domains/clients/useClientState';

interface ClientContextType {
    clients: Client[];
    addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    deleteClient: (clientId: string) => Promise<void>;
    addActivityToClient: (clientId: string, activityData: Omit<ClientActivityLog, 'id' | 'timestamp'>) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const value = useClientState();

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClients = () => {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error('useClients must be used within a ClientProvider');
    }
    return context;
};