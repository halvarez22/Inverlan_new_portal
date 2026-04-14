import { useEffect, useState } from 'react';
import { Client, ClientActivityLog } from '../../types';
import { SAMPLE_CLIENTS } from '../../constants';
import { clientUseCases } from './clientUseCases';
import { loggingService } from '../../services/loggingService';
import { domainBridge } from '../../domainBridge';

export interface ClientStateApi {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  addActivityToClient: (clientId: string, activityData: Omit<ClientActivityLog, 'id' | 'timestamp'>) => Promise<void>;
}

export const useClientState = (): ClientStateApi => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    domainBridge.registerClientDomain({
      getAllClients: async () => clients
    });
  }, [clients]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const firebaseClients = await clientUseCases.getAll();
        if (firebaseClients.length > 0) {
          setClients(firebaseClients);
          try {
            localStorage.setItem('inverland_clients', JSON.stringify(firebaseClients));
          } catch (localError) {
            console.warn('Failed to save to localStorage backup:', localError);
          }
        } else {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

          if (isDevelopment) {
            setClients(SAMPLE_CLIENTS);
            try {
              // Using DomainBridge instead of direct imports
              const firebaseProperties = await domainBridge.propertiesDomain.getAllProperties();
              const firebaseCampaigns = await domainBridge.campaignsDomain.getAllCampaigns();

              if (firebaseProperties.length === 0 && firebaseCampaigns.length === 0) {
                for (const client of SAMPLE_CLIENTS) {
                  await clientUseCases.add(client);
                }
              }
            } catch (migrationError) {
              console.warn('Failed to migrate sample clients to Firebase:', migrationError);
            }
            try {
              localStorage.setItem('inverland_clients', JSON.stringify(SAMPLE_CLIENTS));
            } catch (localError) {
              console.warn('Failed to save sample clients to localStorage:', localError);
            }
          } else {
            setClients([]);
          }
        }
      } catch (error) {
        console.error('Failed to load clients from Firebase:', error);
        try {
          const storedClients = localStorage.getItem('inverland_clients');
          if (storedClients) {
            setClients(JSON.parse(storedClients));
          } else {
            setClients(SAMPLE_CLIENTS);
            localStorage.setItem('inverland_clients', JSON.stringify(SAMPLE_CLIENTS));
          }
        } catch (localError) {
          console.error('Failed to access localStorage for clients:', localError);
          setClients(SAMPLE_CLIENTS);
        }
      }
    };

    loadClients();
  }, []);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const newClient = await clientUseCases.add(client);
      const updatedClients = [newClient, ...clients];
      setClients(updatedClients);

      try {
        localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
      } catch (localError) {
        console.warn('Failed to save to localStorage backup:', localError);
      }
      loggingService.logSecurity('CLIENT_ADD_SUCCESS', true, undefined, undefined, `Added client: ${newClient.id}`);
    } catch (error) {
      loggingService.logSecurity('CLIENT_ADD_FAILURE', false, undefined, undefined, `Failed to add client | ${String(error)}`);
      console.error('Failed to add client to Firebase:', error);
      const newClient: Client = {
        ...client,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updatedClients = [newClient, ...clients];
      setClients(updatedClients);
      localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
    }
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      await clientUseCases.update(updatedClient);
      const updatedClients = clients.map(c => (c.id === updatedClient.id ? updatedClient : c));
      setClients(updatedClients);

      try {
        localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      loggingService.logSecurity('CLIENT_UPDATE_SUCCESS', true, undefined, undefined, `Updated client: ${updatedClient.id}`);
    } catch (error) {
      loggingService.logSecurity('CLIENT_UPDATE_FAILURE', false, undefined, undefined, `Failed to update client: ${updatedClient.id} | ${String(error)}`);
      console.error('Failed to update client in Firebase:', error);
      const updatedClients = clients.map(c => (c.id === updatedClient.id ? updatedClient : c));
      setClients(updatedClients);
      localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      await clientUseCases.remove(clientId);
      const updatedClients = clients.filter(c => c.id !== clientId);
      setClients(updatedClients);

      try {
        localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      loggingService.logSecurity('CLIENT_DELETE_SUCCESS', true, undefined, undefined, `Deleted client: ${clientId}`);
    } catch (error) {
      loggingService.logSecurity('CLIENT_DELETE_FAILURE', false, undefined, undefined, `Failed to delete client: ${clientId} | ${String(error)}`);
      console.error('Failed to delete client from Firebase:', error);
      const updatedClients = clients.filter(c => c.id !== clientId);
      setClients(updatedClients);
      localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
    }
  };

  const addActivityToClient = async (clientId: string, activityData: Omit<ClientActivityLog, 'id' | 'timestamp'>) => {
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

    const clientToUpdate = updatedClients.find(c => c.id === clientId);
    if (clientToUpdate) {
      try {
        await clientUseCases.update(clientToUpdate);
        setClients(updatedClients);
        try {
          localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
        } catch (localError) {
          console.warn('Failed to update localStorage backup:', localError);
        }
      } catch (error) {
        console.error('Failed to update client activity in Firebase:', error);
        setClients(updatedClients);
        localStorage.setItem('inverland_clients', JSON.stringify(updatedClients));
      }
    }
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    addActivityToClient,
  };
};
