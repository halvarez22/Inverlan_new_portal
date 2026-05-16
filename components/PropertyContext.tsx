import React, { createContext, useContext, ReactNode } from 'react';
import { Property, ActivityLog } from '../types';
import { usePropertyState } from '../domains/properties/usePropertyState';

interface PropertyContextType {
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

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const value = usePropertyState();

    return (
        <PropertyContext.Provider value={value}>
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