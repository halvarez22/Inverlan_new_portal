import { useEffect, useState } from 'react';
import { Property, ActivityLog } from '../../types';
import { SAMPLE_PROPERTIES } from '../../constants';
import { propertyUseCases, migrateInvalidPropertyImages, sanitizePropertyImages } from './propertyUseCases';
import { loggingService } from '../../services/loggingService';
import { domainBridge } from '../../domainBridge';

export interface PropertyStateApi {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  assignPropertiesToAgent: (agentId: string, propertyIds: string[]) => void;
  addActivityToProperty: (propertyId: string, activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  assignClientToProperty: (propertyId: string, clientId: string | null) => void;
}

export const usePropertyState = (): PropertyStateApi => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    domainBridge.registerPropertyDomain({
      getAllProperties: async () => properties,
      getPropertyById: async (id: string) => properties.find(p => p.id === id) || null
    });
  }, [properties]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const firebaseProperties = await propertyUseCases.getAll();
        if (firebaseProperties.length > 0) {
          setProperties(firebaseProperties);
          try {
            await migrateInvalidPropertyImages(firebaseProperties);
          } catch (e) {
            console.warn('No se pudo migrar imágenes inválidas:', e);
          }
        } else {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

          if (isDevelopment) {
            setProperties(SAMPLE_PROPERTIES.map(sanitizePropertyImages));
            try {
              // Using DomainBridge instead of direct imports
              const firebaseClients = await domainBridge.clientsDomain.getAllClients();
              const firebaseCampaigns = await domainBridge.campaignsDomain.getAllCampaigns();

              if (firebaseClients.length === 0 && firebaseCampaigns.length === 0) {
                for (const property of SAMPLE_PROPERTIES) {
                  await propertyUseCases.add(property);
                }
              }
            } catch (migrationError) {
              console.warn('Failed to migrate sample properties to Firebase:', migrationError);
            }
          } else {
            setProperties([]);
          }
        }
      } catch (error) {
        console.error('Failed to load properties from Firebase:', error);
        try {
          const storedProperties = localStorage.getItem('inverland_properties');
          if (storedProperties) {
            const parsed: Property[] = JSON.parse(storedProperties);
            setProperties(parsed.map(sanitizePropertyImages));
          } else {
            setProperties(SAMPLE_PROPERTIES.map(sanitizePropertyImages));
          }
        } catch (localError) {
          console.error('Failed to access localStorage for properties:', localError);
          setProperties(SAMPLE_PROPERTIES.map(sanitizePropertyImages));
        }
      }
    };

    loadProperties();
  }, []);

  const saveProperties = (newProperties: Property[]) => {
    try {
      localStorage.setItem('inverland_properties', JSON.stringify(newProperties));
    } catch (error) {
      console.error('Failed to save properties to localStorage:', error);
    }
    setProperties(newProperties);
  };

  const addProperty = async (property: Omit<Property, 'id'>) => {
    try {
      const newProperty = await propertyUseCases.add(property);
      setProperties(prev => [newProperty, ...prev]);

      try {
        const updatedProperties = [newProperty, ...properties.map(sanitizePropertyImages)];
        localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
      } catch (localError) {
        console.warn('Failed to save to localStorage backup:', localError);
      }
      loggingService.logSecurity('PROPERTY_ADD_SUCCESS', true, undefined, undefined, `Added property: ${newProperty.id}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_ADD_FAILURE', false, undefined, undefined, `Failed to add property | ${String(error)}`);
      console.error('Failed to add property to Firebase:', error);
      const newProperty: Property = { ...property, id: `prop-${Date.now()}` };
      const updatedProperties = [...properties, newProperty];
      setProperties(updatedProperties);
      localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    try {
      await propertyUseCases.update(updatedProperty);
      setProperties(prev => prev.map(prop => prop.id === updatedProperty.id ? updatedProperty : prop));

      try {
        const updatedProperties = properties.map(prop => prop.id === updatedProperty.id ? updatedProperty : prop);
        localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      loggingService.logSecurity('PROPERTY_UPDATE_SUCCESS', true, undefined, undefined, `Updated property: ${updatedProperty.id}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_UPDATE_FAILURE', false, undefined, undefined, `Failed to update property: ${updatedProperty.id} | ${String(error)}`);
      console.error('Failed to update property in Firebase:', error);
      const updatedProperties = properties.map(prop => prop.id === updatedProperty.id ? sanitizePropertyImages(updatedProperty) : sanitizePropertyImages(prop));
      setProperties(updatedProperties);
      localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      await propertyUseCases.remove(propertyId);
      setProperties(prev => prev.filter(prop => prop.id !== propertyId));

      try {
        const updatedProperties = properties.filter(prop => prop.id !== propertyId);
        localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      loggingService.logSecurity('PROPERTY_DELETE_SUCCESS', true, undefined, undefined, `Deleted property: ${propertyId}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_DELETE_FAILURE', false, undefined, undefined, `Failed to delete property: ${propertyId} | ${String(error)}`);
      console.error('Failed to delete property from Firebase:', error);
      const updatedProperties = properties.filter(prop => prop.id !== propertyId);
      setProperties(updatedProperties);
      localStorage.setItem('inverland_properties', JSON.stringify(updatedProperties));
    }
  };

  const assignPropertiesToAgent = (agentId: string, propertyIds: string[]) => {
    const updatedProperties = properties.map(prop => {
      if (propertyIds.includes(prop.id)) {
        return { ...prop, agentId: agentId };
      }
      if (prop.agentId === agentId && !propertyIds.includes(prop.id)) {
        return { ...prop, agentId: null };
      }
      return prop;
    });
    saveProperties(updatedProperties);
  };

  const addActivityToProperty = (propertyId: string, activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      ...activityData,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const updatedProperties = properties.map(p => {
      if (p.id === propertyId) {
        const updatedLog = p.activityLog ? [...p.activityLog, newActivity] : [newActivity];
        return { ...p, activityLog: updatedLog };
      }
      return p;
    });
    saveProperties(updatedProperties);
  };

  const assignClientToProperty = (propertyId: string, clientId: string | null) => {
    const updatedProperties = properties.map(p => p.id === propertyId ? { ...p, clientId: clientId } : p);
    saveProperties(updatedProperties);
  };

  return {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    assignPropertiesToAgent,
    addActivityToProperty,
    assignClientToProperty,
  };
};
