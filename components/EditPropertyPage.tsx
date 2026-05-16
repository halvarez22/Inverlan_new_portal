import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { PROPERTY_TYPES, AMENITIES_LIST, ACTIVITY_TYPES } from '../constants';
import { useProperties } from './PropertyContext';
import { usePropertyMedia } from '../domains/properties/usePropertyMedia';
import PropertyMediaSection from './PropertyMediaSection';
import PropertyLocationSection from './propertyForm/PropertyLocationSection';
import PropertyAmenitiesSection from './propertyForm/PropertyAmenitiesSection';
import { InputField, SparklesIcon } from './addProperty/AddPropertyFormPrimitives';
import { formatNumber, parseFormattedNumber } from './addProperty/addPropertyFormUtils';
import { generatePropertyDescription } from '../services/geminiService';

interface EditPropertyPageProps {
    onBack: () => void;
}

const EditPropertyPage: React.FC<EditPropertyPageProps> = ({ onBack }) => {
    const { properties, updateProperty, deleteProperty } = useProperties();
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isEditing, setIsEditing] = useState(false);
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
        latitude: '',
        longitude: '',
        amenities: [],
        status: 'For Sale',
        mainPhotoIndex: 0,
        videos: [],
        video360: '',
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [formattedPrice, setFormattedPrice] = useState<string>('');
    const [formattedRentPrice, setFormattedRentPrice] = useState<string>('');

    const [isLoading, setIsLoading] = useState(false);
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
        setFromExisting,
        resetMedia,
    } = usePropertyMedia({ maxPhotos: 10 });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number' && value === '') {
            setFormData(prev => ({ ...prev, [name]: undefined }));
            return;
        }

        const isNumeric = ['price', 'rentPrice', 'bedrooms', 'bathrooms', 'halfBathrooms', 'parkingSpaces', 'constructionArea', 'landArea', 'landDepth', 'landFront', 'constructionYear', 'floorNumber', 'buildingFloors', 'maintenanceFee', 'latitude', 'longitude'].includes(name);

        if (isNumeric) {
            if (name === 'latitude' || name === 'longitude') {
                if (value === '' || value === '-' || value === '.' || value === '-.' ||
                    value.match(/^-?\d*\.?\d*$/)) {
                    setFormData(prev => ({ ...prev, [name]: value }));
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

    const handlePolicyToggle = (selectedPolicy: string, conflictingPolicy: string) => {
        setFormData(prev => {
            const currentAmenities = prev.amenities || [];
            const filteredAmenities = currentAmenities.filter(a => a !== conflictingPolicy);
            if (!filteredAmenities.includes(selectedPolicy)) {
                return { ...prev, amenities: [...filteredAmenities, selectedPolicy] };
            }
            return { ...prev, amenities: filteredAmenities };
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setFormattedPrice(formatted);
        const numericValue = parseFormattedNumber(formatted);
        setFormData(prev => ({ ...prev, price: numericValue }));
    };

    const handleRentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setFormattedRentPrice(formatted);
        const numericValue = parseFormattedNumber(formatted);
        setFormData(prev => ({ ...prev, rentPrice: numericValue }));
    };

    const handleCoordinatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').trim();
        const fieldName = e.currentTarget.name;
        
        const coordinatePattern = /(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)/;
        const match = pastedText.match(coordinatePattern);
        
        if (match) {
            const [, coord1Str, coord2Str] = match;
            let latitude = parseFloat(coord1Str);
            let longitude = parseFloat(coord2Str);
            
            // Logic to swap lat/long based on Mexican ranges if needed
            if (!(latitude >= 14 && latitude <= 32) && (longitude >= 14 && longitude <= 32)) {
                [latitude, longitude] = [longitude, latitude];
            }
            
            latitude = Math.round(latitude * 1000000) / 1000000;
            longitude = Math.round(longitude * 1000000) / 1000000;
            
            setFormData(prev => ({
                ...prev,
                latitude: latitude,
                longitude: longitude
            }));
        } else {
            const numValue = parseFloat(pastedText);
            if (!isNaN(numValue)) {
                const roundedValue = Math.round(numValue * 1000000) / 1000000;
                setFormData(prev => ({ ...prev, [fieldName]: roundedValue }));
            } else {
                setFormData(prev => ({ ...prev, [fieldName]: pastedText }));
            }
        }
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

    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
        setIsEditing(true);
        
        // Cargar datos de la propiedad en el formulario
        setFormData({
            title: property.title,
            description: property.description,
            type: property.type,
            operationType: property.operationType,
            price: property.price,
            rentPrice: property.rentPrice || 0,
            showPrice: property.showPrice,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            halfBathrooms: property.halfBathrooms || 0,
            parkingSpaces: property.parkingSpaces,
            constructionArea: property.constructionArea,
            landArea: property.landArea || 0,
            landDepth: property.landDepth || 0,
            landFront: property.landFront || 0,
            constructionYear: property.constructionYear,
            floorNumber: property.floorNumber,
            buildingFloors: property.buildingFloors,
            maintenanceFee: property.maintenanceFee || 0,
            internalKey: property.internalKey || '',
            keyLockerCode: property.keyLockerCode || '',
            country: property.country,
            state: property.state,
            city: property.city,
            neighborhood: property.neighborhood || '',
            street: property.street,
            streetNumber: property.streetNumber || '',
            interiorNumber: property.interiorNumber || '',
            crossStreet: property.crossStreet || '',
            zipCode: property.zipCode || '',
            showExactLocation: property.showExactLocation ?? true,
            latitude: property.latitude,
            longitude: property.longitude,
            amenities: property.amenities || [],
            status: property.status,
            mainPhotoIndex: property.mainPhotoIndex || 0,
        });

        setFormattedPrice(formatNumber(property.price.toString()));
        setFormattedRentPrice(formatNumber((property.rentPrice || 0).toString()));

        // Cargar imágenes existentes
        setFromExisting({
            images: property.images,
            mainPhotoIndex: property.mainPhotoIndex || 0,
            videos: property.videos || [],
            video360: property.video360,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProperty) return;

        setIsLoading(true);

        try {
            // Las imágenes ya están comprimidas como data URLs en imagePreviews
            const allImages = imagePreviews;

            const locationString = `${formData.city}, ${formData.state}`;

            // Convertir coordenadas de texto a número y redondear
            const finalLatitude = typeof formData.latitude === 'string' ? parseFloat(formData.latitude) : formData.latitude;
            const finalLongitude = typeof formData.longitude === 'string' ? parseFloat(formData.longitude) : formData.longitude;

            const updatedProperty: Property = {
                ...selectedProperty,
                ...(formData as any),
                latitude: finalLatitude && !isNaN(finalLatitude) ? Math.round(finalLatitude * 1000000) / 1000000 : 0,
                longitude: finalLongitude && !isNaN(finalLongitude) ? Math.round(finalLongitude * 1000000) / 1000000 : 0,
                location: locationString,
                images: allImages, // Imágenes existentes + nuevas comprimidas
                videos: videoUrls, // URLs de YouTube
                video360: video360Urls, // URLs del recorrido 360
                mainPhotoIndex: mainPhotoIndex,
            };
            
            await updateProperty(updatedProperty);
            alert('Propiedad actualizada exitosamente');
            setIsEditing(false);
            setSelectedProperty(null);
            resetMedia();

        } catch (error) {
            console.error("Error updating property:", error);
            const message =
                error instanceof Error && error.message.includes('longer than')
                    ? 'Las imágenes ocupan demasiado espacio para Firestore. Reduce el número de fotos.'
                    : 'No se pudo actualizar la propiedad en Firebase. Revisa la conexión y los permisos.';
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProperty = async () => {
        if (!selectedProperty) return;

        // Validaciones de seguridad para eliminar propiedad
        const canDelete = await validatePropertyDeletion(selectedProperty);
        
        if (!canDelete.canDelete) {
            alert(`❌ No se puede eliminar esta propiedad:\n\n${canDelete.reason}`);
            return;
        }

        // Confirmación final
        const confirmDelete = window.confirm(
            `⚠️ ¿Estás seguro de que deseas eliminar esta propiedad?\n\n` +
            `📋 Propiedad: ${selectedProperty.title}\n` +
            `📍 Ubicación: ${selectedProperty.location}\n\n` +
            `Esta acción NO se puede deshacer.`
        );

        if (!confirmDelete) return;

        try {
            setIsLoading(true);
            await deleteProperty(selectedProperty.id);
            alert('✅ Propiedad eliminada exitosamente');
            
            // Limpiar formulario y volver a la lista
            setIsEditing(false);
            setSelectedProperty(null);
            resetForm();
            
        } catch (error) {
            console.error("Error deleting property:", error);
            alert("❌ Hubo un error al eliminar la propiedad. Por favor, inténtelo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const validatePropertyDeletion = async (_property: Property): Promise<{ canDelete: boolean; reason: string }> => {
        // Por ahora, todas las propiedades se pueden eliminar ya que no están asignadas a agentes
        // En el futuro, aquí se validarán:
        // - Si está asignada a un agente
        // - Si tiene seguimientos/actividades
        // - Si tiene clientes asignados
        // - Si tiene campañas activas
        
        return {
            canDelete: true,
            reason: "✅ Propiedad disponible para eliminación"
        };
    };

    const resetForm = () => {
        setFormData({
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
            constructionYear: 0,
            floorNumber: 0,
            buildingFloors: 0,
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
            latitude: 0,
            longitude: 0,
            amenities: [],
            status: 'Disponible',
            mainPhotoIndex: 0,
        });
        resetMedia();
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setSelectedProperty(null);
        setFormData({
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
            latitude: 19.4326,
            longitude: -99.1332,
            amenities: [],
            status: 'For Sale',
            mainPhotoIndex: 0,
        });
    };

    if (isEditing) {
        return (
            <section className="py-16 md:py-24 bg-gray-100 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-extrabold text-inverland-black">Editar Propiedad</h2>
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Información Básica */}
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

                                {/* Operación y Precio */}
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
                                        <InputField label="Precio de Venta (MXN) *" name="price">
                                            <input
                                                type="text"
                                                name="price"
                                                value={formattedPrice}
                                                onChange={handlePriceChange}
                                                required
                                                placeholder="Ej: 1,500,000.00"
                                                className="mt-1 block w-full input-style"
                                            />
                                        </InputField>
                                    )}
                                    {formData.operationType?.includes('Renta') && (
                                        <InputField label="Precio de Renta (MXN) *" name="rentPrice">
                                            <input
                                                type="text"
                                                name="rentPrice"
                                                value={formattedRentPrice}
                                                onChange={handleRentPriceChange}
                                                required
                                                placeholder="Ej: 15,000.00"
                                                className="mt-1 block w-full input-style"
                                            />
                                        </InputField>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mostrar precios en el anuncio</label>
                                        <div className="mt-2 flex space-x-4">
                                            <label className="flex items-center"><input type="radio" name="showPrice" value="true" checked={formData.showPrice === true} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Sí</span></label>
                                            <label className="flex items-center"><input type="radio" name="showPrice" value="false" checked={formData.showPrice === false} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">No</span></label>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Características */}
                                <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                                    <legend className="text-xl font-bold px-2 text-inverland-dark">Características</legend>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                        {/* Renderizado dinámico de características según el tipo */}
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

                                        {formData.type === 'Terreno' && (
                                            <>
                                                <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                                <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                                                <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                                            </>
                                        )}

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

                                        {formData.type === 'Bodega Industrial' && (
                                            <>
                                                <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                                                <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                                <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                                                <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                                            </>
                                        )}

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
                                        {/* Añadir otros tipos según sea necesario, similar a AddProperty */}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <InputField label="Clave interna" name="internalKey" value={formData.internalKey} onChange={handleInputChange} />
                                        <InputField label="Código de la llave" name="keyLockerCode" value={formData.keyLockerCode} onChange={handleInputChange}/>
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

                                {/* Botones */}
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={handleDeleteProperty}
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Eliminando...' : '🗑️ Eliminar Propiedad'}
                                    </button>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-inverland-blue text-white rounded-lg hover:bg-inverland-light-blue transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-extrabold text-inverland-black">Edición de Fichas</h2>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-inverland-blue text-white rounded-lg hover:bg-inverland-light-blue transition-colors"
                        >
                            Volver al Portal
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-inverland-black mb-6">Selecciona una propiedad para editar</h3>
                        
                        {properties.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">No hay propiedades registradas para editar.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handlePropertySelect(property)}
                                    >
                                        <img
                                            src={property.images[property.mainPhotoIndex || 0] || 'https://picsum.photos/300/200?grayscale'}
                                            alt={property.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <h4 className="font-bold text-lg text-inverland-black mb-2">{property.title}</h4>
                                        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                                        <p className="text-inverland-blue font-semibold">
                                            {(() => {
                                                const isRent = property.operationType.includes('Renta');
                                                const amount = isRent && (property.rentPrice ?? 0) > 0
                                                    ? (property.rentPrice as number)
                                                    : property.price;
                                                return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
                                            })()}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm text-gray-500">{property.type}</span>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                property.operationType.includes('Renta') 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {property.operationType.includes('Renta') ? 'For Rent' : property.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditPropertyPage;
