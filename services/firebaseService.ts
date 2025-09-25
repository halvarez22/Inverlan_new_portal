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
import { db } from '../firebase';
import { Property, Client, Campaign } from '../types';

// Collections
const PROPERTIES_COLLECTION = 'properties';
const CLIENTS_COLLECTION = 'clients';
const CAMPAIGNS_COLLECTION = 'campaigns';

// Property Service
export const propertyService = {
  // Get all properties
  async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(collection(db, PROPERTIES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Property;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting property:', error);
      throw error;
    }
  },

  // Add new property
  async addProperty(property: Omit<Property, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
        ...property,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  },

  // Update property
  async updateProperty(id: string, property: Partial<Property>): Promise<void> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...property,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};

// Client Service
export const clientService = {
  // Get all clients
  async getAllClients(): Promise<Client[]> {
    try {
      const q = query(collection(db, CLIENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  },

  // Get client by ID
  async getClientById(id: string): Promise<Client | null> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Client;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting client:', error);
      throw error;
    }
  },

  // Add new client
  async addClient(client: Omit<Client, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
        ...client,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...client,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id: string): Promise<void> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

// Campaign Service
export const campaignService = {
  // Get all campaigns
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const q = query(collection(db, CAMPAIGNS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  },

  // Get campaign by ID
  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Campaign;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  },

  // Add new campaign
  async addCampaign(campaign: Omit<Campaign, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CAMPAIGNS_COLLECTION), {
        ...campaign,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding campaign:', error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      await updateDoc(docRef, {
        ...campaign,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
};
