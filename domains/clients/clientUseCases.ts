import { Client } from '../../types';
import { clientRepository } from './clientRepository';

export const clientUseCases = {
  async getAll(): Promise<Client[]> {
    return clientRepository.getAll();
  },
  async add(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const id = await clientRepository.add(client);
    return {
      ...client,
      id,
      createdAt: new Date().toISOString(),
    };
  },
  async update(client: Client): Promise<void> {
    await clientRepository.update(client.id, client);
  },
  async remove(clientId: string): Promise<void> {
    await clientRepository.remove(clientId);
  },
};
