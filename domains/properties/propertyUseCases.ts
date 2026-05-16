import { Property } from '../../types';
import { propertyRepository } from './propertyRepository';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/600/400?grayscale';

const isValidImageSrc = (src?: string) => {
  if (!src) return false;
  return src.startsWith('http') || src.startsWith('data:');
};

export const sanitizePropertyImages = (property: Property): Property => {
  const safeImages = (property.images || []).map(img => isValidImageSrc(img) ? img : PLACEHOLDER_IMAGE);
  const safeMainIndex = Number.isInteger(property.mainPhotoIndex) && property.mainPhotoIndex! >= 0 && property.mainPhotoIndex! < safeImages.length ? property.mainPhotoIndex : 0;
  return { ...property, images: safeImages, mainPhotoIndex: safeMainIndex };
};

export const migrateInvalidPropertyImages = async (properties: Property[]): Promise<void> => {
  const toMigrate = properties.filter(p => (p.images || []).some(img => img && img.startsWith('blob:')));
  for (const property of toMigrate) {
    const migratedImages = (property.images || []).map(img => isValidImageSrc(img) ? img : PLACEHOLDER_IMAGE);
    const safeMainIndex = Number.isInteger(property.mainPhotoIndex) && (property.mainPhotoIndex as number) >= 0 && (property.mainPhotoIndex as number) < migratedImages.length ? property.mainPhotoIndex : 0;
    await propertyRepository.update(property.id, { images: migratedImages, mainPhotoIndex: safeMainIndex });
  }
};

export const propertyUseCases = {
  async getAll(): Promise<Property[]> {
    const properties = await propertyRepository.getAll();
    return properties.map(sanitizePropertyImages);
  },
  subscribe(
    onData: (properties: Property[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    return propertyRepository.subscribe(
      (properties) => onData(properties.map(sanitizePropertyImages)),
      onError
    );
  },
  async add(property: Omit<Property, 'id'>): Promise<Property> {
    const id = await propertyRepository.add(property);
    return sanitizePropertyImages({ ...property, id });
  },
  async update(property: Property): Promise<void> {
    await propertyRepository.update(property.id, property);
  },
  async remove(propertyId: string): Promise<void> {
    await propertyRepository.remove(propertyId);
  },
};
