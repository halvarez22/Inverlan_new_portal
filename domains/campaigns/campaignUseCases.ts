import { Campaign, Client } from '../../types';
import { campaignRepository } from './campaignRepository';

export const campaignUseCases = {
  async getAll(): Promise<Campaign[]> {
    return campaignRepository.getAll();
  },
  async add(campaign: Omit<Campaign, 'id' | 'status' | 'sentToCount' | 'sentAt'>): Promise<Campaign> {
    const newCampaignData: Omit<Campaign, 'id'> = {
      ...campaign,
      status: 'Borrador',
      sentToCount: 0,
    };
    const id = await campaignRepository.add(newCampaignData);
    return { ...newCampaignData, id };
  },
  async update(campaign: Campaign): Promise<void> {
    await campaignRepository.update(campaign.id, campaign);
  },
  async remove(campaignId: string): Promise<void> {
    await campaignRepository.remove(campaignId);
  },
  resolveTargetClients(campaign: Campaign, allClients: Client[]): Client[] {
    return allClients.filter(client => {
      const statusMatch = campaign.targetAudience.status.length === 0 || campaign.targetAudience.status.includes(client.status);
      const sourceMatch = campaign.targetAudience.leadSource.length === 0 || (client.leadSource && campaign.targetAudience.leadSource.includes(client.leadSource));
      return statusMatch && sourceMatch;
    });
  },
};
