import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Client, ClientActivityLog } from '../types';
import { SAMPLE_CLIENTS } from '../constants';
import { clientService } from '../services/firebaseService';

interface ClientContextType {
    clients: Client[];
    addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
    updateClient: (client: Client) => void;
    deleteClient: (clientId: string) => void;
    addActivityToClient: (clientId: string, activityData: Omit<ClientActivityLog, 'id' | 'timestamp'>) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        try {
            const storedClients = localStorage.getItem('inverland_clients');
            if (storedClients) {
                setClients(JSON.parse(storedClients));
            } else {
                setClients(SAMPLE_CLIENTS);
                localStorage.setItem('inverland_clients', JSON.stringify(SAMPLE_CLIENTS));
            }
        } catch (error) {
            console.error("Failed to access localStorage for clients:", error);
            setClients(SAMPLE_CLIENTS);
        }
    }, []);

    const saveClients = (newClients: Client[]) => {
        try {
            localStorage.setItem('inverland_clients', JSON.stringify(newClients));
        } catch (error) {
            console.error("Failed to save clients to localStorage:", error);
        }
        setClients(newClients);
    };

    const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
        const newClient: Client = { 
            ...client, 
            id: `client-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const updatedClients = [...clients, newClient];
        saveClients(updatedClients);
    };

    const updateClient = (updatedClient: Client) => {
        const updatedClients = clients.map(c => (c.id === updatedClient.id ? updatedClient : c));
        saveClients(updatedClients);
    };

    const deleteClient = (clientId: string) => {
        const updatedClients = clients.filter(c => c.id !== clientId);
        saveClients(updatedClients);
    };
    
    const addActivityToClient = (clientId: string, activityData: Omit<ClientActivityLog, 'id' | 'timestamp'>) => {
        const newActivity: ClientActivityLog = {
            ...activityData,
            id: `client-activity-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        const updatedClients = clients.map(c => {
            if (c.id === clientId) {
                const updatedLog = c.activityLog ? [...c.activityLog, newActivity] : [newActivity];
                return { ...c, activityLog: updatedLog };
            }
            return c;
        });
        saveClients(updatedClients);
    };

    return (
        <ClientContext.Provider value={{ clients, addClient, updateClient, deleteClient, addActivityToClient }}>
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