import React from 'react';

interface PropertyAmenitiesSectionProps {
  amenitiesCatalog: Record<string, string[]>;
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
  onPolicyToggle: (selectedPolicy: string, conflictingPolicy: string) => void;
}

const PropertyAmenitiesSection: React.FC<PropertyAmenitiesSectionProps> = ({
  amenitiesCatalog,
  selectedAmenities,
  onAmenityToggle,
  onPolicyToggle,
}) => {
  return (
    <fieldset className="p-4 md:p-6 border rounded-lg">
      <legend className="text-xl font-bold px-2 text-inverland-dark">Amenidades</legend>
      <div className="space-y-6 mt-4">
        {(Object.entries(amenitiesCatalog) as Array<[string, string[]]>).map(([category, amenities]) => (
          <div key={category}>
            <h4 className="font-semibold text-gray-800 border-b pb-2 mb-3">{category}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {category === 'Políticas' ? (
                <>
                  <div className="col-span-full">
                    <h5 className="font-medium text-gray-700 mb-2">Mascotas:</h5>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pets"
                          value="Mascotas permitidas"
                          checked={selectedAmenities.includes('Mascotas permitidas')}
                          onChange={() => onPolicyToggle('Mascotas permitidas', 'No se aceptan mascotas')}
                          className="h-4 w-4 text-inverland-green border-gray-300 focus:ring-inverland-green"
                        />
                        <span className="text-gray-700 text-sm">Mascotas permitidas</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pets"
                          value="No se aceptan mascotas"
                          checked={selectedAmenities.includes('No se aceptan mascotas')}
                          onChange={() => onPolicyToggle('No se aceptan mascotas', 'Mascotas permitidas')}
                          className="h-4 w-4 text-inverland-green border-gray-300 focus:ring-inverland-green"
                        />
                        <span className="text-gray-700 text-sm">No se aceptan mascotas</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <h5 className="font-medium text-gray-700 mb-2">Fumar:</h5>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="smoking"
                          value="Permitido fumar"
                          checked={selectedAmenities.includes('Permitido fumar')}
                          onChange={() => onPolicyToggle('Permitido fumar', 'Prohibido fumar')}
                          className="h-4 w-4 text-inverland-green border-gray-300 focus:ring-inverland-green"
                        />
                        <span className="text-gray-700 text-sm">Permitido fumar</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="smoking"
                          value="Prohibido fumar"
                          checked={selectedAmenities.includes('Prohibido fumar')}
                          onChange={() => onPolicyToggle('Prohibido fumar', 'Permitido fumar')}
                          className="h-4 w-4 text-inverland-green border-gray-300 focus:ring-inverland-green"
                        />
                        <span className="text-gray-700 text-sm">Prohibido fumar</span>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => onAmenityToggle(amenity)}
                      className="h-4 w-4 text-inverland-green rounded border-gray-300 focus:ring-inverland-green"
                    />
                    <span className="text-gray-700 text-sm">{amenity}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default PropertyAmenitiesSection;

