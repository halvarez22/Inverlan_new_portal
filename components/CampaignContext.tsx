import React, { createContext, useContext, ReactNode } from 'react';
import { Campaign, Client } from '../types';
import { useCampaignState } from '../domains/campaigns/useCampaignState';

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>) => Promise<void>;
    updateCampaign: (campaign: Campaign) => Promise<void>;
    deleteCampaign: (campaignId: string) => Promise<void>;
    sendCampaign: (campaignId: string, allClients: Client[]) => Promise<Client[]>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const value = useCampaignState();

    return (
        <CampaignContext.Provider value={value}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error('useCampaigns must be used within a CampaignProvider');
    }
    return context;
};