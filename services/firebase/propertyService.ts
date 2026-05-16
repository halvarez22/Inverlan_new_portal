import {

  collection,

  doc,

  addDoc,

  updateDoc,

  deleteDoc,

  getDocs,

  getDoc,

  onSnapshot,

  serverTimestamp,

  type Unsubscribe,

} from 'firebase/firestore';

import { db } from '../../firebase';

import { Property } from '../../types';



const PROPERTIES_COLLECTION = 'properties';



type PropertyDoc = Property & { createdAt?: unknown; updatedAt?: unknown };



const mapDocToProperty = (snapshot: { id: string; data: () => Record<string, unknown> }): PropertyDoc =>

  ({

    id: snapshot.id,

    ...snapshot.data(),

  }) as PropertyDoc;



const createdAtToMillis = (value: unknown): number => {

  if (value == null) return 0;

  if (typeof value === 'string') {

    const parsed = Date.parse(value);

    return Number.isNaN(parsed) ? 0 : parsed;

  }

  if (typeof value === 'object' && value !== null && 'toMillis' in value) {

    const toMillis = (value as { toMillis?: () => number }).toMillis;

    if (typeof toMillis === 'function') return toMillis.call(value);

  }

  return 0;

};



const sortPropertiesByCreatedAt = (properties: PropertyDoc[]): PropertyDoc[] =>

  [...properties].sort((a, b) => createdAtToMillis(b.createdAt) - createdAtToMillis(a.createdAt));



const fetchAllFromCollection = async (): Promise<PropertyDoc[]> => {

  const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));

  return sortPropertiesByCreatedAt(querySnapshot.docs.map(mapDocToProperty));

};



export const propertyService = {

  async getAllProperties(): Promise<Property[]> {

    return fetchAllFromCollection();

  },



  subscribeToProperties(

    onData: (properties: Property[]) => void,

    onError?: (error: Error) => void

  ): Unsubscribe {

    return onSnapshot(

      collection(db, PROPERTIES_COLLECTION),

      (querySnapshot) => {

        const properties = sortPropertiesByCreatedAt(querySnapshot.docs.map(mapDocToProperty));

        onData(properties);

      },

      (error) => {

        onError?.(error instanceof Error ? error : new Error(String(error)));

      }

    );

  },



  async getPropertyById(id: string): Promise<Property | null> {

    try {

      const docRef = doc(db, PROPERTIES_COLLECTION, id);

      const docSnap = await getDoc(docRef);



      if (docSnap.exists()) {

        return {

          id: docSnap.id,

          ...docSnap.data(),

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

        updatedAt: serverTimestamp(),

      });

      return docRef.id;

    } catch (error) {

      throw error;

    }

  },



  async updateProperty(id: string, property: Partial<Property>): Promise<void> {

    try {

      const { id: _docId, ...fields } = property;

      const cleanProperty = Object.fromEntries(

        Object.entries(fields).filter(([_, value]) => value !== undefined)

      );



      const docRef = doc(db, PROPERTIES_COLLECTION, id);

      await updateDoc(docRef, {

        ...cleanProperty,

        updatedAt: serverTimestamp(),

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

  },

};


