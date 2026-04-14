import React, { useState, useEffect } from 'react';
import { propertyService } from '../domains/properties/propertyService';
import { clientService } from '../domains/clients/clientService';
import { campaignService } from '../domains/campaigns/campaignService';
import { SAMPLE_PROPERTIES, SAMPLE_CLIENTS, SAMPLE_CAMPAIGNS } from '../constants';

interface MigrationStatus {
    properties: 'pending' | 'migrating' | 'completed' | 'error';
    clients: 'pending' | 'migrating' | 'completed' | 'error';
    campaigns: 'pending' | 'migrating' | 'completed' | 'error';
}

const DataMigration: React.FC = () => {
    const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
        properties: 'pending',
        clients: 'pending',
        campaigns: 'pending'
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkAndMigrate = async () => {
            // Solo mostrar migración en desarrollo local, NO en producción
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            if (!isDevelopment) {
                console.log('Production environment - skipping migration UI');
                return;
            }

            try {
                // Verificar si hay datos en Firebase
                const [firebaseProperties, firebaseClients, firebaseCampaigns] = await Promise.all([
                    propertyService.getAllProperties(),
                    clientService.getAllClients(),
                    campaignService.getAllCampaigns()
                ]);

                const needsMigration = 
                    firebaseProperties.length === 0 || 
                    firebaseClients.length === 0 || 
                    firebaseCampaigns.length === 0;

                if (needsMigration) {
                    setIsVisible(true);
                    await performMigration();
                }
            } catch (error) {
                console.error('Error checking migration status:', error);
            }
        };

        checkAndMigrate();
        // performMigration is intentionally defined in-component because
        // it depends on runtime migration status updates during the flow.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const performMigration = async () => {
        // Migrar propiedades
        if (migrationStatus.properties === 'pending') {
            setMigrationStatus(prev => ({ ...prev, properties: 'migrating' }));
            try {
                const existingProperties = await propertyService.getAllProperties();
                if (existingProperties.length === 0) {
                    for (const property of SAMPLE_PROPERTIES) {
                        await propertyService.addProperty(property);
                    }
                }
                setMigrationStatus(prev => ({ ...prev, properties: 'completed' }));
            } catch (error) {
                console.error('Error migrating properties:', error);
                setMigrationStatus(prev => ({ ...prev, properties: 'error' }));
            }
        }

        // Migrar clientes
        if (migrationStatus.clients === 'pending') {
            setMigrationStatus(prev => ({ ...prev, clients: 'migrating' }));
            try {
                const existingClients = await clientService.getAllClients();
                if (existingClients.length === 0) {
                    for (const client of SAMPLE_CLIENTS) {
                        await clientService.addClient(client);
                    }
                }
                setMigrationStatus(prev => ({ ...prev, clients: 'completed' }));
            } catch (error) {
                console.error('Error migrating clients:', error);
                setMigrationStatus(prev => ({ ...prev, clients: 'error' }));
            }
        }

        // Migrar campañas
        if (migrationStatus.campaigns === 'pending') {
            setMigrationStatus(prev => ({ ...prev, campaigns: 'migrating' }));
            try {
                const existingCampaigns = await campaignService.getAllCampaigns();
                if (existingCampaigns.length === 0) {
                    for (const campaign of SAMPLE_CAMPAIGNS) {
                        await campaignService.addCampaign(campaign);
                    }
                }
                setMigrationStatus(prev => ({ ...prev, campaigns: 'completed' }));
            } catch (error) {
                console.error('Error migrating campaigns:', error);
                setMigrationStatus(prev => ({ ...prev, campaigns: 'error' }));
            }
        }

        // Ocultar después de 5 segundos si todo está completo
        setTimeout(() => {
            const allComplete = Object.values(migrationStatus).every(status => 
                status === 'completed' || status === 'error'
            );
            if (allComplete) {
                setIsVisible(false);
            }
        }, 5000);
    };

    if (!isVisible) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'migrating': return '🔄';
            case 'completed': return '✅';
            case 'error': return '❌';
            default: return '⏳';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'migrating': return 'Migrando...';
            case 'completed': return 'Completado';
            case 'error': return 'Error';
            default: return 'Pendiente';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Migrando datos a Firebase
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Propiedades</span>
                        <div className="flex items-center space-x-2">
                            <span>{getStatusIcon(migrationStatus.properties)}</span>
                            <span className="text-sm text-gray-600">
                                {getStatusText(migrationStatus.properties)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Clientes</span>
                        <div className="flex items-center space-x-2">
                            <span>{getStatusIcon(migrationStatus.clients)}</span>
                            <span className="text-sm text-gray-600">
                                {getStatusText(migrationStatus.clients)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Campañas</span>
                        <div className="flex items-center space-x-2">
                            <span>{getStatusIcon(migrationStatus.campaigns)}</span>
                            <span className="text-sm text-gray-600">
                                {getStatusText(migrationStatus.campaigns)}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Los datos se están migrando a Firebase para garantizar la persistencia.
                </p>
            </div>
        </div>
    );
};

export default DataMigration;
