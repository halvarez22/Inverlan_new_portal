import { Property } from '../../types';
import { sanitizePropertyImages } from './propertyUseCases';

const BACKUP_KEY = 'inverland_properties';

export const readLocalPropertiesBackup = (): Property[] => {
  try {
    const stored = localStorage.getItem(BACKUP_KEY);
    if (!stored) return [];
    const parsed: Property[] = JSON.parse(stored);
    return parsed.map(sanitizePropertyImages);
  } catch {
    return [];
  }
};

export const isFirestorePermissionError = (error: unknown): boolean => {
  const err = error as { code?: string; message?: string };
  return (
    err?.code === 'permission-denied' ||
    (typeof err?.message === 'string' && err.message.toLowerCase().includes('permission'))
  );
};

export const getPropertiesLoadErrorMessage = (error: unknown): string => {
  if (isFirestorePermissionError(error)) {
    return 'Firestore bloqueó la lectura del catálogo. Publica reglas con lectura pública en la colección properties.';
  }
  return 'No se pudieron cargar las propiedades desde Firebase.';
};
