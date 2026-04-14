import { Client } from '../../types';
import { clientService } from './clientService';

export const clientRepository = {
  async getAll(): Promise<Client[]> {
    return clientService.getAllClients();
  },
  async add(client: Omit<Client, 'id'>): Promise<string> {
    return clientService.addClient(client);
  },
  async update(id: string, client: Partial<Client>): Promise<void> {
    return clientService.updateClient(id, client);
  },
  async remove(id: string): Promise<void> {
    return clientService.deleteClient(id);
  },
};
