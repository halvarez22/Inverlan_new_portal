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
import { Client } from '../../types';

const CLIENTS_COLLECTION = 'clients';

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const q = query(collection(db, CLIENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
    } catch (error) {
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Client;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async addClient(client: Omit<Client, 'id'>): Promise<string> {
    try {
      const cleanClient = Object.fromEntries(
        Object.entries(client).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
        ...cleanClient,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    try {
      const cleanClient = Object.fromEntries(
        Object.entries(client).filter(([_, value]) => value !== undefined)
      );

      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...cleanClient,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
};
