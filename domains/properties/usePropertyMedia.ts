import { useCallback, useState } from 'react';
import { compressImage, isValidHttpUrl, normalizeUrl } from '../../utils/media';

export interface PropertyMediaState {
  imageFiles: File[];
  imagePreviews: string[];
  mainPhotoIndex: number;
  videoUrls: string[];
  video360Urls: string[];
}

export interface PropertyMediaApi extends PropertyMediaState {
  handleFileChange: (e: import('react').ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeFile: (index: number) => void;
  setMainPhoto: (index: number) => void;
  addVideoUrl: () => void;
  editVideoUrl: (index: number) => void;
  removeVideoUrl: (index: number) => void;
  addVideo360Url: () => void;
  removeVideo360Url: (index: number) => void;
  setFromExisting: (input: {
    images?: string[];
    mainPhotoIndex?: number;
    videos?: string[];
    video360?: string | string[];
  }) => void;
  resetMedia: () => void;
}

const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

export const usePropertyMedia = (options?: { maxPhotos?: number }): PropertyMediaApi => {
  const maxPhotos = options?.maxPhotos ?? 10;

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState<number>(0);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [video360Urls, setVideo360Urls] = useState<string[]>([]);

  const handleFileChange = useCallback(async (e: import('react').ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files) as File[];
    const currentImageCount = imagePreviews.length;
    const newFilesCount = files.length;
    const maxRemaining = Math.max(0, maxPhotos - currentImageCount);

    if (maxRemaining <= 0) {
      alert(`Máximo ${maxPhotos} fotos por propiedad. Ya tienes ${maxPhotos} fotos.`);
      return;
    }

    const acceptedFiles = newFilesCount > maxRemaining ? files.slice(0, maxRemaining) : files;
    if (newFilesCount > maxRemaining) {
      alert(`Máximo ${maxPhotos} fotos por propiedad. Actualmente tienes ${currentImageCount} fotos y estás intentando agregar ${newFilesCount}. Solo se agregarán ${maxRemaining} fotos.`);
    }

    setImageFiles(prev => [...prev, ...acceptedFiles]);
    const newPreviews = await Promise.all(acceptedFiles.map(async file => compressImage(file, 800, 0.7)));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, [imagePreviews.length, maxPhotos]);

  const removeFile = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0);
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(prev => Math.max(0, prev - 1));
    }
  }, [mainPhotoIndex]);

  const setMainPhoto = useCallback((index: number) => {
    setMainPhotoIndex(index);
  }, []);

  const addVideoUrl = useCallback(() => {
    const url = prompt('Ingresa la URL del video de YouTube:');
    if (!url || !url.trim()) return;
    const value = url.trim();
    if (!isYouTubeUrl(value)) {
      alert('Por favor ingresa una URL válida de YouTube');
      return;
    }
    setVideoUrls(prev => [...prev, value]);
  }, []);

  const editVideoUrl = useCallback((index: number) => {
    const current = videoUrls[index] || '';
    const input = prompt('Edita la URL del video de YouTube:', current);
    if (!input) return;
    const value = input.trim();
    if (!isYouTubeUrl(value)) {
      alert('Por favor ingresa una URL válida de YouTube');
      return;
    }
    setVideoUrls(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [videoUrls]);

  const removeVideoUrl = useCallback((index: number) => {
    setVideoUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addVideo360Url = useCallback(() => {
    const input = prompt('Ingresa la URL del recorrido virtual 360°:');
    if (!input) return;
    const normalized = normalizeUrl(input);
    if (!isValidHttpUrl(normalized)) {
      alert('Por favor ingresa una URL válida (http/https).');
      return;
    }
    setVideo360Urls(prev => prev.includes(normalized) ? prev : [...prev, normalized]);
  }, []);

  const removeVideo360Url = useCallback((index: number) => {
    setVideo360Urls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const setFromExisting = useCallback((input: {
    images?: string[];
    mainPhotoIndex?: number;
    videos?: string[];
    video360?: string | string[];
  }) => {
    setImageFiles([]);
    setImagePreviews(input.images ?? []);
    setMainPhotoIndex(input.mainPhotoIndex ?? 0);
    setVideoUrls(input.videos ?? []);
    const v360 = input.video360;
    setVideo360Urls(Array.isArray(v360) ? v360 : (v360 ? [v360] : []));
  }, []);

  const resetMedia = useCallback(() => {
    setImageFiles([]);
    setImagePreviews([]);
    setMainPhotoIndex(0);
    setVideoUrls([]);
    setVideo360Urls([]);
  }, []);

  return {
    imageFiles,
    imagePreviews,
    mainPhotoIndex,
    videoUrls,
    video360Urls,
    handleFileChange,
    removeFile,
    setMainPhoto,
    addVideoUrl,
    editVideoUrl,
    removeVideoUrl,
    addVideo360Url,
    removeVideo360Url,
    setFromExisting,
    resetMedia,
  };
};

