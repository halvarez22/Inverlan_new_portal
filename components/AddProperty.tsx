import React, { useState } from 'react';
import { useProperties } from './PropertyContext';
import { Property } from '../types';
import { PROPERTY_TYPES, AMENITIES_LIST } from '../constants';
import { generatePropertyDescription } from '../services/geminiService';
import { usePropertyMedia } from '../domains/properties/usePropertyMedia';
import PropertyMediaSection from './PropertyMediaSection';
import PropertyLocationSection from './propertyForm/PropertyLocationSection';
import PropertyAmenitiesSection from './propertyForm/PropertyAmenitiesSection';
import { InputField, SparklesIcon } from './addProperty/AddPropertyFormPrimitives';
import { formatNumber, parseFormattedNumber } from './addProperty/addPropertyFormUtils';

const devLog = (...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(...args);
};

interface AddPropertyProps {
    onPropertyAdded: () => void;
}

const AddProperty: React.FC<AddPropertyProps> = ({ onPropertyAdded }) => {
    const { addProperty } = useProperties();
    
    const [formData, setFormData] = useState<Omit<Property, 'id' | 'images' | 'videos' | 'location'> & { latitude?: string | number; longitude?: string | number }>({
        title: '',
        description: '',
        type: PROPERTY_TYPES[0],
        operationType: 'Venta',
        price: 0,
        rentPrice: 0,
        showPrice: true,
        bedrooms: 0,
        bathrooms: 0,
        halfBathrooms: 0,
        parkingSpaces: 0,
        constructionArea: 0,
        landArea: 0,
        landDepth: 0,
        landFront: 0,
        constructionYear: undefined,
        floorNumber: undefined,
        buildingFloors: undefined,
        maintenanceFee: 0,
        internalKey: '',
        keyLockerCode: '',
        country: 'México',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        streetNumber: '',
        interiorNumber: '',
        crossStreet: '',
        zipCode: '',
        showExactLocation: true,
        latitude: '', // Coordenadas como string para preservar formato decimal
        longitude: '', // Coordenadas como string para preservar formato decimal
        amenities: [],
        status: 'For Sale',
        videos: [],
        video360: '',
    });

    const {
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
        resetMedia,
    } = usePropertyMedia({ maxPhotos: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formattedPrice, setFormattedPrice] = useState<string>('');
    const [formattedRentPrice, setFormattedRentPrice] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number' && value === '') {
             setFormData(prev => ({ ...prev, [name]: undefined }));
             return;
        }
        
        const isNumeric = ['price', 'rentPrice', 'bedrooms', 'bathrooms', 'halfBathrooms', 'parkingSpaces', 'constructionArea', 'landArea', 'landDepth', 'landFront', 'constructionYear', 'floorNumber', 'buildingFloors', 'maintenanceFee', 'latitude', 'longitude'].includes(name);

        if (isNumeric) {
            // Para coordenadas, manejar como texto para preservar formato decimal
            if (name === 'latitude' || name === 'longitude') {
                devLog(`Coordenada ${name}`, { original: value });
                if (value === '' || value === '-' || value === '.' || value === '-.' ||
                    value.match(/^-?\d*\.?\d*$/)) {
                    setFormData(prev => ({ ...prev, [name]: value }));
                } else if (import.meta.env.DEV) {
                    console.warn(`Formato inválido para ${name}`);
                }
            } else {
                setFormData(prev => ({ ...prev, [name]: Number(value) }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === 'true' ? true : value === 'false' ? false : value }));
    }

    // Función para manejar pegado inteligente de coordenadas
    const handleCoordinatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').trim();
        const fieldName = e.currentTarget.name;
        
        devLog('Pegado de coordenadas', { fieldName });
        
        // Detectar si el texto pegado contiene ambas coordenadas (separadas por coma, espacio, etc.)
        const coordinatePattern = /(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)/;
        const match = pastedText.match(coordinatePattern);
        
        if (match) {
            const [, coord1Str, coord2Str] = match;
            const coord1 = parseFloat(coord1Str);
            const coord2 = parseFloat(coord2Str);
            
            devLog('Coordenadas detectadas en pegado');
            
            // Determinar cuál es latitud y cuál es longitud basado en los rangos
            let latitude, longitude;
            
            // Para México, la latitud está entre 14-32 y longitud entre -118 a -86
            if (coord1 >= 14 && coord1 <= 32 && coord2 >= -118 && coord2 <= -86) {
                // coord1 es latitud, coord2 es longitud
                latitude = coord1;
                longitude = coord2;
            } else if (coord2 >= 14 && coord2 <= 32 && coord1 >= -118 && coord1 <= -86) {
                // coord2 es latitud, coord1 es longitud
                latitude = coord2;
                longitude = coord1;
            } else {
                // Usar rangos generales
                if (coord1 >= -90 && coord1 <= 90 && (coord2 < -90 || coord2 > 90)) {
                    latitude = coord1;
                    longitude = coord2;
                } else if (coord2 >= -90 && coord2 <= 90 && (coord1 < -90 || coord1 > 90)) {
                    latitude = coord2;
                    longitude = coord1;
                } else {
                    // Si ambos están en rango de latitud, usar el orden original
                    latitude = coord1;
                    longitude = coord2;
                }
            }
            
            // CORRECCIÓN: Redondear a 6 decimales para evitar problemas de precisión
            latitude = Math.round(latitude * 1000000) / 1000000;
            longitude = Math.round(longitude * 1000000) / 1000000;
            
            devLog('Coordenadas asignadas (redondeadas)');
            
            // Actualizar ambos campos
            setFormData(prev => ({
                ...prev,
                latitude: latitude,
                longitude: longitude
            }));
        } else {
            // Si no es un par de coordenadas, pegar normalmente
            const numValue = parseFloat(pastedText);
            if (!isNaN(numValue)) {
                // Redondear también valores individuales
                const roundedValue = Math.round(numValue * 1000000) / 1000000;
                setFormData(prev => ({ ...prev, [fieldName]: roundedValue }));
            } else {
                // Si no es un número válido, mantener el texto para permitir escritura parcial
                setFormData(prev => ({ ...prev, [fieldName]: pastedText }));
            }
        }
    };
    
    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => {
            const currentAmenities = prev.amenities || [];
            if (currentAmenities.includes(amenity)) {
                return { ...prev, amenities: currentAmenities.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...currentAmenities, amenity] };
            }
        });
    };

    // Función para manejar políticas (radio buttons) - solo una opción por grupo
    const handlePolicyToggle = (selectedPolicy: string, conflictingPolicy: string) => {
        setFormData(prev => {
            const currentAmenities = prev.amenities || [];
            // Remover la política conflictiva si existe
            const filteredAmenities = currentAmenities.filter(a => a !== conflictingPolicy);
            // Agregar la política seleccionada si no existe
            if (!filteredAmenities.includes(selectedPolicy)) {
                return { ...prev, amenities: [...filteredAmenities, selectedPolicy] };
            }
            return { ...prev, amenities: filteredAmenities };
        });
    };
    
    // Manejar cambio en precio de venta
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setFormattedPrice(formatted);
        const numericValue = parseFormattedNumber(formatted);
        setFormData(prev => ({ ...prev, price: numericValue }));
    };

    // Manejar cambio en precio de renta
    const handleRentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setFormattedRentPrice(formatted);
        const numericValue = parseFormattedNumber(formatted);
        setFormData(prev => ({ ...prev, rentPrice: numericValue }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.type || !formData.city || !formData.state) {
            alert("Por favor, completa al menos el tipo de propiedad, estado y ciudad antes de generar la descripción.");
            return;
        }
        setIsGenerating(true);
        try {
            const description = await generatePropertyDescription({
                type: formData.type,
                city: formData.city,
                state: formData.state,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                amenities: formData.amenities,
            });
            setFormData(prev => ({...prev, description }));
        } catch (error) {
            console.error("Error generating description", error);
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Preparar datos para envío, convirtiendo coordenadas de texto a número
            const submitData = { ...formData };
            
            // Convertir coordenadas de texto a número y redondear
            if (submitData.latitude) {
                const latValue = typeof submitData.latitude === 'string' ? parseFloat(submitData.latitude) : submitData.latitude;
                if (!isNaN(latValue)) {
                    submitData.latitude = Math.round(latValue * 1000000) / 1000000;
                }
            }
            
            if (submitData.longitude) {
                const lngValue = typeof submitData.longitude === 'string' ? parseFloat(submitData.longitude) : submitData.longitude;
                if (!isNaN(lngValue)) {
                    submitData.longitude = Math.round(lngValue * 1000000) / 1000000;
                }
            }
            
            // Validar coordenadas antes de enviar
            if (submitData.latitude && submitData.longitude) {
                if (submitData.latitude < -90 || submitData.latitude > 90) {
                    alert('La latitud debe estar entre -90 y 90 grados');
                    setIsLoading(false);
                    return;
                }
                if (submitData.longitude < -180 || submitData.longitude > 180) {
                    alert('La longitud debe estar entre -180 y 180 grados');
                    setIsLoading(false);
                    return;
                }
            }
            
            // Las imágenes ya están comprimidas como data URLs en imagePreviews
            const images = imagePreviews;

            const locationString = `${submitData.city}, ${submitData.state}`;

            const newProperty: Omit<Property, 'id'> = {
                ...(submitData as any), // Cast to any to handle optional number fields
                location: locationString,
                images,
                videos: videoUrls, // URLs de YouTube
                video360: video360Urls, // URLs del recorrido 360
                mainPhotoIndex: mainPhotoIndex
            };
            
            addProperty(newProperty);
            resetMedia();
            onPropertyAdded();

        } catch (error) {
            console.error("Error creating property:", error);
            alert("Hubo un error al crear la propiedad. Por favor, inténtelo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="py-16 md:py-24 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl space-y-8">
                    <h2 className="text-3xl font-extrabold text-inverland-dark text-center">Registrar Nuevo Inmueble</h2>
                    
                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Información Básica</legend>
                        <InputField label="Tipo de propiedad" name="type" required onChange={handleInputChange}>
                           <select name="type" id="type" required value={formData.type} onChange={handleInputChange} className="mt-1 block w-full input-style">
                               {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </InputField>
                        <InputField label="Título del anuncio" name="title" required value={formData.title} onChange={handleInputChange} />
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del anuncio<span className="text-red-500">*</span></label>
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating}
                                    className="flex items-center text-xs font-semibold text-inverland-blue hover:text-inverland-dark transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-inverland-blue mr-2"></div>
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4 mr-1" />
                                            Generar con IA
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea name="description" id="description" required value={formData.description} rows={5} onChange={handleInputChange} className="mt-1 block w-full input-style" placeholder="Describe la propiedad o genera una descripción con IA..."></textarea>
                            <p className="text-xs text-gray-500 mt-1">Para una descripción más precisa, completa los campos de tipo, ubicación, recámaras, baños y amenidades.</p>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Operación y Precio</legend>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Operación<span className="text-red-500">*</span></label>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                <label className="flex items-center"><input type="radio" name="operationType" value="Venta" checked={formData.operationType === 'Venta'} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Venta</span></label>
                                <label className="flex items-center"><input type="radio" name="operationType" value="Renta" checked={formData.operationType === 'Renta'} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Renta</span></label>
                                <label className="flex items-center"><input type="radio" name="operationType" value="Renta temporal" checked={formData.operationType === 'Renta temporal'} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Renta temporal</span></label>
                            </div>
                        </div>
                        {formData.operationType === 'Venta' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio de Venta (MXN) *</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formattedPrice}
                                    onChange={handlePriceChange}
                                    required
                                    placeholder="Ej: 1,500,000.00"
                                    className="mt-1 block w-full input-style"
                                />
                            </div>
                        )}
                        {formData.operationType?.includes('Renta') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio de Renta (MXN) *</label>
                                <input
                                    type="text"
                                    name="rentPrice"
                                    value={formattedRentPrice}
                                    onChange={handleRentPriceChange}
                                    required
                                    placeholder="Ej: 15,000.00"
                                    className="mt-1 block w-full input-style"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mostrar precios en el anuncio</label>
                            <div className="mt-2 flex space-x-4">
                                <label className="flex items-center"><input type="radio" name="showPrice" value="true" checked={formData.showPrice === true} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Sí</span></label>
                                <label className="flex items-center"><input type="radio" name="showPrice" value="false" checked={formData.showPrice === false} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">No</span></label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Características</legend>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {/* Campos para CASAS */}
                            {formData.type === 'Casa' && (
                                <>
                                    <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                                    <InputField label="Medios baños" name="halfBathrooms" type="number" placeholder="No indicado" value={formData.halfBathrooms} onChange={handleInputChange}/>
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                                    <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                </>
                            )}

                            {/* Campos para DEPARTAMENTOS */}
                            {formData.type === 'Departamento' && (
                                <>
                                    <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                                    <InputField label="Medios baños" name="halfBathrooms" type="number" placeholder="No indicado" value={formData.halfBathrooms} onChange={handleInputChange}/>
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Piso" name="floorNumber" type="number" placeholder="No indicado" value={formData.floorNumber} onChange={handleInputChange}/>
                                    <InputField label="Pisos edif." name="buildingFloors" type="number" placeholder="No indicado" value={formData.buildingFloors} onChange={handleInputChange}/>
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                    <InputField label="Mantenim." name="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleInputChange} />
                                </>
                            )}

                            {/* Campos para TERRENOS */}
                            {formData.type === 'Terreno' && (
                                <>
                                    <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                                    <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                                </>
                            )}

                            {/* Campos para OFICINAS */}
                            {formData.type === 'Oficina' && (
                                <>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Piso" name="floorNumber" type="number" placeholder="No indicado" value={formData.floorNumber} onChange={handleInputChange}/>
                                    <InputField label="Pisos edif." name="buildingFloors" type="number" placeholder="No indicado" value={formData.buildingFloors} onChange={handleInputChange}/>
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                    <InputField label="Mantenim." name="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleInputChange} />
                                </>
                            )}

                            {/* Campos para LOCALES COMERCIALES */}
                            {formData.type === 'Local Comercial' && (
                                <>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Piso" name="floorNumber" type="number" placeholder="No indicado" value={formData.floorNumber} onChange={handleInputChange}/>
                                    <InputField label="Pisos edif." name="buildingFloors" type="number" placeholder="No indicado" value={formData.buildingFloors} onChange={handleInputChange}/>
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                    <InputField label="Mantenim." name="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleInputChange} />
                                </>
                            )}

                            {/* Campos para BODEGAS INDUSTRIALES */}
                            {formData.type === 'Bodega Industrial' && (
                                <>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                </>
                            )}

                            {/* Campos para LOFTS */}
                            {formData.type === 'Loft' && (
                                <>
                                    <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Piso" name="floorNumber" type="number" placeholder="No indicado" value={formData.floorNumber} onChange={handleInputChange}/>
                                    <InputField label="Pisos edif." name="buildingFloors" type="number" placeholder="No indicado" value={formData.buildingFloors} onChange={handleInputChange}/>
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                    <InputField label="Mantenim." name="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleInputChange} />
                                </>
                            )}

                            {/* Campos para VILLAS */}
                            {formData.type === 'Villa' && (
                                <>
                                    <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                                    <InputField label="Medios baños" name="halfBathrooms" type="number" placeholder="No indicado" value={formData.halfBathrooms} onChange={handleInputChange}/>
                                    <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                                    <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                </>
                            )}

                            {/* Campos para HACIENDAS */}
                            {formData.type === 'Hacienda' && (
                                <>
                                    <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                                    <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                    <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                                    <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                                    <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                </>
                            )}
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <InputField label="Clave interna" name="internalKey" placeholder="Ej. DPTO123" value={formData.internalKey} onChange={handleInputChange} />
                            <InputField label="Código de la llave" name="keyLockerCode" placeholder="Ej. C123" value={formData.keyLockerCode} onChange={handleInputChange}/>
                         </div>
                    </fieldset>
                    
                    <PropertyLocationSection
                        InputField={InputField}
                        formData={formData}
                        onChange={handleInputChange}
                        onRadioChange={handleRadioChange}
                        onCoordinatePaste={handleCoordinatePaste}
                    />
                    
                    <PropertyAmenitiesSection
                        amenitiesCatalog={AMENITIES_LIST}
                        selectedAmenities={formData.amenities}
                        onAmenityToggle={handleAmenityToggle}
                        onPolicyToggle={handlePolicyToggle}
                    />
                    
                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Multimedia</legend>
                        <PropertyMediaSection
                            imageFiles={imageFiles}
                            imagePreviews={imagePreviews}
                            mainPhotoIndex={mainPhotoIndex}
                            videoUrls={videoUrls}
                            video360Urls={video360Urls}
                            onFileChange={handleFileChange}
                            onRemoveFile={removeFile}
                            onSetMainPhoto={setMainPhoto}
                            onAddVideo={addVideoUrl}
                            onEditVideo={editVideoUrl}
                            onRemoveVideo={removeVideoUrl}
                            onAddVideo360={addVideo360Url}
                            onRemoveVideo360={removeVideo360Url}
                            onEditVideo360={(index, url) => {
                                const input = prompt('Edita la URL del recorrido 360°:', url);
                                if (!input) return;
                                const normalized = input.trim();
                                removeVideo360Url(index);
                                const originalPrompt = window.prompt;
                                window.prompt = () => normalized;
                                try { addVideo360Url(); } finally { window.prompt = originalPrompt; }
                            }}
                            maxPhotos={10}
                        />
                    </fieldset>
                    
                    <style>{`
                        .input-style { background-color: white; color: #1F2937; border-radius: 0.375rem; border-width: 1px; border-color: #D1D5DB; padding: 0.5rem 0.75rem; width: 100%; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } 
                        .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #083d5c; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #083d5c; }
                        .radio-style { color: #083d5c; focus:ring-inverland-green; }
                    `}</style>
                    
                    <div className="text-right">
                        <button type="submit" disabled={isLoading} className="bg-inverland-green text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:scale-100">
                           {isLoading ? 'Guardando...' : 'Guardar Inmueble'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddProperty;