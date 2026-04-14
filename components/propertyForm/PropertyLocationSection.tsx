import React from 'react';

type InputFieldLikeProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  children?: React.ReactNode;
};

interface PropertyLocationSectionProps {
  InputField: React.ComponentType<InputFieldLikeProps>;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoordinatePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({
  InputField,
  formData,
  onChange,
  onRadioChange,
  onCoordinatePaste,
}) => {
  return (
    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
      <legend className="text-xl font-bold px-2 text-inverland-dark">Ubicación</legend>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <InputField label="País" name="country" value="México" onChange={() => {}} />
        <InputField label="Estado" name="state" required value={formData.state} onChange={onChange} />
        <InputField label="Ciudad" name="city" required value={formData.city} onChange={onChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InputField label="Colonia" name="neighborhood" value={formData.neighborhood} onChange={onChange} />
        <InputField label="Código Postal" name="zipCode" value={formData.zipCode} onChange={onChange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <InputField label="Calle" name="street" required value={formData.street} onChange={onChange} />
        <InputField label="Número" name="streetNumber" value={formData.streetNumber} onChange={onChange} />
        <InputField label="Interior" name="interiorNumber" value={formData.interiorNumber} onChange={onChange} />
        <InputField label="Esquina con" name="crossStreet" value={formData.crossStreet} onChange={onChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitud</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude ?? ''}
            onChange={onChange}
            onPaste={onCoordinatePaste}
            placeholder="Ej: 21.1098"
            className="mt-1 block w-full input-style"
          />
          <p className="text-xs text-gray-500 mt-1">Coordenada norte-sur (-90 a 90)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitud</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude ?? ''}
            onChange={onChange}
            onPaste={onCoordinatePaste}
            placeholder="Ej: -101.6878"
            className="mt-1 block w-full input-style"
          />
          <p className="text-xs text-gray-500 mt-1">Coordenada este-oeste (-180 a 180)</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📍 ¿Cómo obtener coordenadas?</h4>
        <p className="text-sm text-blue-700 mb-2">Puedes obtener las coordenadas exactas de varias formas:</p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• <strong>Google Maps:</strong> Click derecho en la ubicación → "¿Qué hay aquí?"</li>
          <li>• <strong>Maps.app:</strong> Mantén presionado en la ubicación</li>
          <li>• <strong>Coordenadas comunes:</strong></li>
          <li className="ml-4">- León, Gto: Lat 21.1098, Lng -101.6878</li>
          <li className="ml-4">- Mérida, Yuc: Lat 20.9674, Lng -89.5926</li>
          <li className="ml-4">- CDMX: Lat 19.4326, Lng -99.1332</li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mostrar ubicación exacta</label>
        <div className="mt-2 flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="showExactLocation" value="true" checked={formData.showExactLocation === true} onChange={onRadioChange} className="radio-style" />
            <span className="ml-2">Sí</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="showExactLocation" value="false" checked={formData.showExactLocation === false} onChange={onRadioChange} className="radio-style" />
            <span className="ml-2">No</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">Si eliges no mostrar la ubicación exacta, algunas apps y portales podrían no publicar el anuncio.</p>
      </div>
    </fieldset>
  );
};

export default PropertyLocationSection;

