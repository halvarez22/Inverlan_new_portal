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
import { Property } from '../../types';

const PROPERTIES_COLLECTION = 'properties';

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(collection(db, PROPERTIES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      throw error;
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Property;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async addProperty(property: Omit<Property, 'id'>): Promise<string> {
    try {
      const cleanProperty = Object.fromEntries(
        Object.entries(property).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
        ...cleanProperty,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<void> {
    try {
      const cleanProperty = Object.fromEntries(
        Object.entries(property).filter(([_, value]) => value !== undefined)
      );

      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...cleanProperty,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
};
