import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Campaign } from '../../types';

const CAMPAIGNS_COLLECTION = 'campaigns';

export const campaignService = {
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const q = query(collection(db, CAMPAIGNS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
    } catch (error) {
      throw error;
    }
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Campaign;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async addCampaign(campaign: Omit<Campaign, 'id'>): Promise<string> {
    try {
      const cleanCampaign = Object.fromEntries(
        Object.entries(campaign).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, CAMPAIGNS_COLLECTION), {
        ...cleanCampaign,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<void> {
    try {
      const cleanCampaign = Object.fromEntries(
        Object.entries(campaign).filter(([_, value]) => value !== undefined)
      );

      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      await updateDoc(docRef, {
        ...cleanCampaign,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteCampaign(id: string): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
};
