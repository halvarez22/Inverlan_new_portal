import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Property, ActivityLog } from '../types';
import { SAMPLE_PROPERTIES } from '../constants';

interface PropertyContextType {
    properties: Property[];
    addProperty: (property: Omit<Property, 'id'>) => void;
    updateProperty: (property: Property) => void;
    deleteProperty: (propertyId: string) => void;
    assignPropertiesToAgent: (agentId: string, propertyIds: string[]) => void;
    addActivityToProperty: (propertyId: string, activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
    assignClientToProperty: (propertyId: string, clientId: string | null) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        try {
            const storedProperties = localStorage.getItem('inverland_properties');
            if (storedProperties) {
                setProperties(JSON.parse(storedProperties));
            } else {
                setProperties(SAMPLE_PROPERTIES);
                localStorage.setItem('inverland_properties', JSON.stringify(SAMPLE_PROPERTIES));
            }
        } catch (error) {
            console.error("Failed to access localStorage for properties:", error);
            setProperties(SAMPLE_PROPERTIES);
        }
    }, []);

    const saveProperties = (newProperties: Property[]) => {
        try {
            localStorage.setItem('inverland_properties', JSON.stringify(newProperties));
        } catch (error) {
            console.error("Failed to save properties to localStorage:", error);
        }
        setProperties(newProperties);
    };

    const addProperty = (property: Omit<Property, 'id'>) => {
        const newProperty: Property = { ...property, id: `prop-${Date.now()}` };
        const updatedProperties = [...properties, newProperty];
        saveProperties(updatedProperties);
    };

    const updateProperty = (updatedProperty: Property) => {
        const updatedProperties = properties.map(p => (p.id === updatedProperty.id ? updatedProperty : p));
        saveProperties(updatedProperties);
    };

    const deleteProperty = (propertyId: string) => {
        const updatedProperties = properties.filter(p => p.id !== propertyId);
        saveProperties(updatedProperties);
    };

    const assignPropertiesToAgent = (agentId: string, propertyIds: string[]) => {
        const updatedProperties = properties.map(prop => {
            // Assign property if it's in the list
            if (propertyIds.includes(prop.id)) {
                return { ...prop, agentId: agentId };
            }
            // Unassign property if it previously belonged to this agent but is no longer selected
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
        const updatedProperties = properties.map(p => {
            if (p.id === propertyId) {
                return { ...p, clientId: clientId };
            }
            return p;
        });
        saveProperties(updatedProperties);
    };

    return (
        <PropertyContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty, assignPropertiesToAgent, addActivityToProperty, assignClientToProperty }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const useProperties = () => {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error('useProperties must be used within a PropertyProvider');
    }
    return context;
};