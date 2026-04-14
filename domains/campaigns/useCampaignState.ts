import { useEffect, useState } from 'react';
import { Campaign, Client } from '../../types';
import { SAMPLE_CAMPAIGNS } from '../../constants';
import { campaignUseCases } from './campaignUseCases';
import { domainBridge } from '../../domainBridge';

export interface CampaignStateApi {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>) => Promise<void>;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  sendCampaign: (campaignId: string, allClients: Client[]) => Promise<Client[]>;
}

export const useCampaignState = (): CampaignStateApi => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    domainBridge.registerCampaignDomain({
      getAllCampaigns: async () => campaigns
    });
  }, [campaigns]);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const firebaseCampaigns = await campaignUseCases.getAll();
        if (firebaseCampaigns.length > 0) {
          setCampaigns(firebaseCampaigns);
          try {
            localStorage.setItem('inverland_campaigns', JSON.stringify(firebaseCampaigns));
          } catch (localError) {
            console.warn('Failed to save to localStorage backup:', localError);
          }
        } else {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

          if (isDevelopment) {
            setCampaigns(SAMPLE_CAMPAIGNS);
            try {
              // Using DomainBridge instead of direct imports
              const firebaseProperties = await domainBridge.propertiesDomain.getAllProperties();
              const firebaseClients = await domainBridge.clientsDomain.getAllClients();

              if (firebaseProperties.length === 0 && firebaseClients.length === 0) {
                for (const campaign of SAMPLE_CAMPAIGNS) {
                  await campaignUseCases.add(campaign);
                }
              }
            } catch (migrationError) {
              console.warn('Failed to migrate sample campaigns to Firebase:', migrationError);
            }
          } else {
            setCampaigns([]);
          }
        }
      } catch (error) {
        console.error('Failed to load campaigns from Firebase:', error);
        try {
          const storedCampaigns = localStorage.getItem('inverland_campaigns');
          if (storedCampaigns) {
            setCampaigns(JSON.parse(storedCampaigns));
          } else {
            setCampaigns(SAMPLE_CAMPAIGNS);
            localStorage.setItem('inverland_campaigns', JSON.stringify(SAMPLE_CAMPAIGNS));
          }
        } catch (localError) {
          console.error('Failed to access localStorage for campaigns:', localError);
          setCampaigns(SAMPLE_CAMPAIGNS);
        }
      }
    };

    loadCampaigns();
  }, []);

  const addCampaign = async (campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>) => {
    try {
      const newCampaign = await campaignUseCases.add(campaign);
      const updatedCampaigns = [newCampaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      try {
        localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
      } catch (localError) {
        console.warn('Failed to save to localStorage backup:', localError);
      }
    } catch (error) {
      console.error('Failed to add campaign to Firebase:', error);
      const newCampaign: Campaign = {
        ...campaign,
        id: `campaign-${Date.now()}`,
        status: 'Borrador',
        sentToCount: 0,
      };
      const updatedCampaigns = [newCampaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
    }
  };

  const updateCampaign = async (updatedCampaign: Campaign) => {
    try {
      await campaignUseCases.update(updatedCampaign);
      const updatedCampaigns = campaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c));
      setCampaigns(updatedCampaigns);
      try {
        localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
    } catch (error) {
      console.error('Failed to update campaign in Firebase:', error);
      const updatedCampaigns = campaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c));
      setCampaigns(updatedCampaigns);
      localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await campaignUseCases.remove(campaignId);
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      try {
        localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
    } catch (error) {
      console.error('Failed to delete campaign from Firebase:', error);
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
    }
  };

  const sendCampaign = async (campaignId: string, allClients: Client[]): Promise<Client[]> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign || campaign.status === 'Enviada') {
      console.warn('Campaign not found or already sent.');
      return [];
    }

    const targetClients = campaignUseCases.resolveTargetClients(campaign, allClients);
    const updatedCampaign: Campaign = {
      ...campaign,
      status: 'Enviada',
      sentAt: new Date().toISOString(),
      sentToCount: targetClients.length,
    };

    try {
      await campaignUseCases.update(updatedCampaign);
      const updatedCampaigns = campaigns.map(c => (c.id === campaignId ? updatedCampaign : c));
      setCampaigns(updatedCampaigns);
      try {
        localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
    } catch (error) {
      console.error('Failed to update campaign status in Firebase:', error);
      const updatedCampaigns = campaigns.map(c => (c.id === campaignId ? updatedCampaign : c));
      setCampaigns(updatedCampaigns);
      localStorage.setItem('inverland_campaigns', JSON.stringify(updatedCampaigns));
    }

    return targetClients;
  };

  return {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
  };
};
