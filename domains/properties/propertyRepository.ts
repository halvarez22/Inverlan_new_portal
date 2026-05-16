import { Property } from '../../types';
import { propertyService } from './propertyService';

export const propertyRepository = {
  async getAll(): Promise<Property[]> {
    return propertyService.getAllProperties();
  },
  subscribe(
    onData: (properties: Property[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    return propertyService.subscribeToProperties(onData, onError);
  },
  async add(property: Omit<Property, 'id'>): Promise<string> {
    return propertyService.addProperty(property);
  },
  async update(id: string, property: Partial<Property>): Promise<void> {
    return propertyService.updateProperty(id, property);
  },
  async remove(id: string): Promise<void> {
    return propertyService.deleteProperty(id);
  },
};
