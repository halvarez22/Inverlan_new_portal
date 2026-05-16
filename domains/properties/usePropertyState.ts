import { useEffect, useRef, useState } from 'react';
import { Property, ActivityLog } from '../../types';
import { SAMPLE_PROPERTIES } from '../../constants';
import { propertyUseCases, migrateInvalidPropertyImages, sanitizePropertyImages } from './propertyUseCases';
import {
  getPropertiesLoadErrorMessage,
  isFirestorePermissionError,
  readLocalPropertiesBackup,
} from './propertyLoadUtils';
import { loggingService } from '../../services/loggingService';
import { domainBridge } from '../../domainBridge';

export interface PropertyStateApi {
  properties: Property[];
  isLoadingProperties: boolean;
  propertiesLoadError: string | null;
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  assignPropertiesToAgent: (agentId: string, propertyIds: string[]) => Promise<void>;
  addActivityToProperty: (propertyId: string, activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
  assignClientToProperty: (propertyId: string, clientId: string | null) => Promise<void>;
}

export const usePropertyState = (): PropertyStateApi => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesLoadError, setPropertiesLoadError] = useState<string | null>(null);
  const imageMigrationDone = useRef(false);
  const devSampleSeedAttempted = useRef(false);

  const persistPropertiesBackup = (next: Property[]) => {
    try {
      localStorage.setItem('inverland_properties', JSON.stringify(next.map(sanitizePropertyImages)));
    } catch (error) {
      console.error('Failed to save properties to localStorage:', error);
    }
  };

  const recoverFromLoadFailure = async (error: unknown) => {
    if (!isFirestorePermissionError(error)) {
      console.error('Error cargando propiedades desde Firebase:', error);
    }
    setPropertiesLoadError(getPropertiesLoadErrorMessage(error));

    try {
      const fromFirebase = await propertyUseCases.getAll();
      if (fromFirebase.length > 0) {
        setProperties(fromFirebase);
        persistPropertiesBackup(fromFirebase);
        setPropertiesLoadError(null);
        return;
      }
    } catch {
      // mismo fallo que la suscripción
    }

    const backup = readLocalPropertiesBackup();
    if (backup.length > 0) {
      setProperties(backup);
      setPropertiesLoadError(
        'Mostrando datos guardados en este navegador. Verifica reglas de Firestore y variables en Vercel.'
      );
      return;
    }

    setProperties([]);
  };

  useEffect(() => {
    domainBridge.registerPropertyDomain({
      getAllProperties: async () => properties,
      getPropertyById: async (id: string) => properties.find(p => p.id === id) || null
    });
  }, [properties]);

  useEffect(() => {
    const applyFirebaseProperties = async (firebaseProperties: Property[]) => {
      setProperties(firebaseProperties);
      persistPropertiesBackup(firebaseProperties);
      setPropertiesLoadError(null);

      if (!imageMigrationDone.current && firebaseProperties.length > 0) {
        imageMigrationDone.current = true;
        try {
          await migrateInvalidPropertyImages(firebaseProperties);
        } catch (e) {
          console.warn('No se pudo migrar imágenes inválidas:', e);
        }
      }
    };

    const maybeSeedDevSamples = async () => {
      const isDevelopment =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isDevelopment || devSampleSeedAttempted.current) return;
      devSampleSeedAttempted.current = true;

      setProperties(SAMPLE_PROPERTIES.map(sanitizePropertyImages));
      try {
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
    };

    setIsLoadingProperties(true);

    const unsubscribe = propertyUseCases.subscribe(
      async (firebaseProperties) => {
        setIsLoadingProperties(false);

        if (firebaseProperties.length > 0) {
          await applyFirebaseProperties(firebaseProperties);
          return;
        }

        const isDevelopment =
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isDevelopment) {
          await maybeSeedDevSamples();
        } else {
          setProperties([]);
          setPropertiesLoadError(
            'No hay propiedades en Firebase para este proyecto. Confirma VITE_FIREBASE_PROJECT_ID en Vercel.'
          );
        }
      },
      async (error) => {
        setIsLoadingProperties(false);
        await recoverFromLoadFailure(error);
      }
    );

    return () => unsubscribe();
  }, []);

  const persistPropertyToFirebase = async (property: Property) => {
    await propertyUseCases.update(sanitizePropertyImages(property));
  };

  const addProperty = async (property: Omit<Property, 'id'>) => {
    try {
      const newProperty = await propertyUseCases.add(property);
      setProperties(prev => {
        const next = [newProperty, ...prev];
        persistPropertiesBackup(next);
        return next;
      });
      loggingService.logSecurity('PROPERTY_ADD_SUCCESS', true, undefined, undefined, `Added property: ${newProperty.id}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_ADD_FAILURE', false, undefined, undefined, `Failed to add property | ${String(error)}`);
      console.error('Failed to add property to Firebase:', error);
      throw error;
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    try {
      await propertyUseCases.update(updatedProperty);
      setProperties(prev => {
        const next = prev.map(prop => (prop.id === updatedProperty.id ? updatedProperty : prop));
        persistPropertiesBackup(next);
        return next;
      });
      loggingService.logSecurity('PROPERTY_UPDATE_SUCCESS', true, undefined, undefined, `Updated property: ${updatedProperty.id}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_UPDATE_FAILURE', false, undefined, undefined, `Failed to update property: ${updatedProperty.id} | ${String(error)}`);
      console.error('Failed to update property in Firebase:', error);
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      await propertyUseCases.remove(propertyId);
      setProperties(prev => {
        const next = prev.filter(prop => prop.id !== propertyId);
        persistPropertiesBackup(next);
        return next;
      });
      loggingService.logSecurity('PROPERTY_DELETE_SUCCESS', true, undefined, undefined, `Deleted property: ${propertyId}`);
    } catch (error) {
      loggingService.logSecurity('PROPERTY_DELETE_FAILURE', false, undefined, undefined, `Failed to delete property: ${propertyId} | ${String(error)}`);
      console.error('Failed to delete property from Firebase:', error);
      throw error;
    }
  };

  const assignPropertiesToAgent = async (agentId: string, propertyIds: string[]) => {
    const updatedProperties = properties.map(prop => {
      if (propertyIds.includes(prop.id)) {
        return { ...prop, agentId };
      }
      if (prop.agentId === agentId && !propertyIds.includes(prop.id)) {
        return { ...prop, agentId: null };
      }
      return prop;
    });

    const changed = updatedProperties.filter(next => {
      const prev = properties.find(p => p.id === next.id);
      return prev != null && prev.agentId !== next.agentId;
    });

    try {
      await Promise.all(changed.map(persistPropertyToFirebase));
      setProperties(updatedProperties);
      persistPropertiesBackup(updatedProperties);
    } catch (error) {
      console.error('Failed to assign properties to agent in Firebase:', error);
      throw error;
    }
  };

  const addActivityToProperty = async (propertyId: string, activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      ...activityData,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const target = properties.find(p => p.id === propertyId);
    if (!target) return;

    const updatedProperty: Property = {
      ...target,
      activityLog: target.activityLog ? [...target.activityLog, newActivity] : [newActivity],
    };

    try {
      await persistPropertyToFirebase(updatedProperty);
      const updatedProperties = properties.map(p => (p.id === propertyId ? updatedProperty : p));
      setProperties(updatedProperties);
      persistPropertiesBackup(updatedProperties);
    } catch (error) {
      console.error('Failed to save property activity in Firebase:', error);
      throw error;
    }
  };

  const assignClientToProperty = async (propertyId: string, clientId: string | null) => {
    const target = properties.find(p => p.id === propertyId);
    if (!target) return;

    const updatedProperty: Property = { ...target, clientId };

    try {
      await persistPropertyToFirebase(updatedProperty);
      const updatedProperties = properties.map(p => (p.id === propertyId ? updatedProperty : p));
      setProperties(updatedProperties);
      persistPropertiesBackup(updatedProperties);
    } catch (error) {
      console.error('Failed to assign client to property in Firebase:', error);
      throw error;
    }
  };

  return {
    properties,
    isLoadingProperties,
    propertiesLoadError,
    addProperty,
    updateProperty,
    deleteProperty,
    assignPropertiesToAgent,
    addActivityToProperty,
    assignClientToProperty,
  };
};
