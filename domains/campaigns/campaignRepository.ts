import { Campaign } from '../../types';
import { campaignService } from './campaignService';

export const campaignRepository = {
  async getAll(): Promise<Campaign[]> {
    return campaignService.getAllCampaigns();
  },
  async add(campaign: Omit<Campaign, 'id'>): Promise<string> {
    return campaignService.addCampaign(campaign);
  },
  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    return campaignService.updateCampaign(id, campaign);
  },
  async remove(id: string): Promise<void> {
    return campaignService.deleteCampaign(id);
  },
};
