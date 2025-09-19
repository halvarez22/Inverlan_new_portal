import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Campaign, Client } from '../types';
import { SAMPLE_CAMPAIGNS } from '../constants';

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>) => void;
    updateCampaign: (campaign: Campaign) => void;
    deleteCampaign: (campaignId: string) => void;
    sendCampaign: (campaignId: string, allClients: Client[]) => Client[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        try {
            const storedCampaigns = localStorage.getItem('inverland_campaigns');
            if (storedCampaigns) {
                setCampaigns(JSON.parse(storedCampaigns));
            } else {
                setCampaigns(SAMPLE_CAMPAIGNS);
                localStorage.setItem('inverland_campaigns', JSON.stringify(SAMPLE_CAMPAIGNS));
            }
        } catch (error) {
            console.error("Failed to access localStorage for campaigns:", error);
            setCampaigns(SAMPLE_CAMPAIGNS);
        }
    }, []);

    const saveCampaigns = (newCampaigns: Campaign[]) => {
        try {
            localStorage.setItem('inverland_campaigns', JSON.stringify(newCampaigns));
        } catch (error) {
            console.error("Failed to save campaigns to localStorage:", error);
        }
        setCampaigns(newCampaigns);
    };

    const addCampaign = (campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>) => {
        const newCampaign: Campaign = { 
            ...campaign, 
            id: `campaign-${Date.now()}`,
            status: 'Borrador',
            sentToCount: 0,
        };
        saveCampaigns([...campaigns, newCampaign]);
    };

    const updateCampaign = (updatedCampaign: Campaign) => {
        saveCampaigns(campaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c)));
    };

    const deleteCampaign = (campaignId: string) => {
        saveCampaigns(campaigns.filter(c => c.id !== campaignId));
    };
    
    const sendCampaign = (campaignId: string, allClients: Client[]): Client[] => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign || campaign.status === 'Enviada') {
            console.warn("Campaign not found or already sent.");
            return [];
        }

        const targetClients = allClients.filter(client => {
            const statusMatch = campaign.targetAudience.status.length === 0 || campaign.targetAudience.status.includes(client.status);
            const sourceMatch = campaign.targetAudience.leadSource.length === 0 || (client.leadSource && campaign.targetAudience.leadSource.includes(client.leadSource));
            return statusMatch && sourceMatch;
        });

        const updatedCampaign: Campaign = {
            ...campaign,
            status: 'Enviada',
            sentAt: new Date().toISOString(),
            sentToCount: targetClients.length,
        };
        
        updateCampaign(updatedCampaign);
        return targetClients;
    };


    return (
        <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, deleteCampaign, sendCampaign }}>
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