import React from 'react';

interface PropertyMediaSectionProps {
  imageFiles: File[];
  imagePreviews: string[];
  mainPhotoIndex: number;
  videoUrls: string[];
  video360Urls: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSetMainPhoto: (index: number) => void;
  onAddVideo: () => void;
  onEditVideo: (index: number) => void;
  onRemoveVideo: (index: number) => void;
  onAddVideo360: () => void;
  onRemoveVideo360: (index: number) => void;
  onEditVideo360?: (index: number, currentUrl: string) => void;
  maxPhotos?: number;
}

const PropertyMediaSection: React.FC<PropertyMediaSectionProps> = ({
  imageFiles,
  imagePreviews,
  mainPhotoIndex,
  videoUrls,
  video360Urls,
  onFileChange,
  onRemoveFile,
  onSetMainPhoto,
  onAddVideo,
  onEditVideo,
  onRemoveVideo,
  onAddVideo360,
  onRemoveVideo360,
  onEditVideo360,
  maxPhotos = 10,
}) => {
  return (
    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
      <legend className="text-xl font-bold px-2 text-inverland-dark">Media</legend>

      {/* Fotos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos de la Propiedad
          <span className="text-sm text-gray-500 ml-2">({imagePreviews.length}/{maxPhotos} fotos)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          disabled={imageFiles.length >= maxPhotos}
          className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-inverland-blue/10 file:text-inverland-blue hover:file:bg-inverland-blue/20 ${imageFiles.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {imageFiles.length >= maxPhotos && (
          <p className="text-xs text-red-600 mt-2">Máximo {maxPhotos} fotos por propiedad.</p>
        )}

        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden">
                <img src={src} alt={`preview-${index}`} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSetMainPhoto(index)}
                    className={`px-2 py-1 text-xs rounded ${index === mainPhotoIndex ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}
                  >
                    {index === mainPhotoIndex ? '⭐ Principal' : 'Hacer principal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
                {index === mainPhotoIndex && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos */}
      <hr className="my-4 border-gray-200" />
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Videos de YouTube
          <span className="text-sm text-gray-500 ml-2">({videoUrls.length} videos)</span>
        </label>
        <button
          type="button"
          onClick={onAddVideo}
          className="mb-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          + Agregar Video de YouTube
        </button>

        {videoUrls.length > 0 && (
          <div className="mt-2 space-y-2">
            {videoUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 flex-1 truncate">{url}</span>
                <button type="button" onClick={() => onEditVideo(index)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Editar
                </button>
                <button type="button" onClick={() => onRemoveVideo(index)} className="text-red-600 hover:text-red-800 text-sm">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 360 */}
      <hr className="my-4 border-gray-200" />
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recorridos Virtuales 360°
          <span className="text-sm text-gray-500 ml-2">({video360Urls.length} recorridos)</span>
        </label>
        <button
          type="button"
          onClick={onAddVideo360}
          className="mb-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          + Agregar Recorrido 360
        </button>

        {video360Urls.length > 0 && (
          <div className="mt-2 space-y-2">
            {video360Urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 flex-1 truncate">{url}</span>
                {onEditVideo360 && (
                  <button
                    type="button"
                    onClick={() => onEditVideo360(index, url)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveVideo360(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default PropertyMediaSection;

