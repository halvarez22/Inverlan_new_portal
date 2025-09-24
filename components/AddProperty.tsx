import React, { useState } from 'react';
import { useProperties } from './PropertyContext';
import { Property } from '../types';
import { PROPERTY_TYPES, AMENITIES_LIST } from '../constants';
import { generatePropertyDescription } from '../services/geminiService';

interface AddPropertyProps {
    onPropertyAdded: () => void;
}

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);


const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Define InputField props for type safety
interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value?: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    children?: React.ReactNode;
}

// Moved InputField component outside of AddProperty to prevent re-definition on every render
const InputField: React.FC<InputFieldProps> = ({label, name, type="text", required=false, placeholder, value, onChange, children}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
        {children ? children : (
            <input type={type} name={name} id={name} required={required} placeholder={placeholder} value={value ?? ''} onChange={onChange} className="mt-1 block w-full input-style"/>
        )}
    </div>
);


const AddProperty: React.FC<AddPropertyProps> = ({ onPropertyAdded }) => {
    const { addProperty } = useProperties();
    
    const [formData, setFormData] = useState<Omit<Property, 'id' | 'images' | 'videos' | 'location'>>({
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
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number' && value === '') {
             setFormData(prev => ({ ...prev, [name]: undefined }));
             return;
        }
        
        const isNumeric = ['price', 'rentPrice', 'bedrooms', 'bathrooms', 'halfBathrooms', 'parkingSpaces', 'constructionArea', 'landArea', 'landDepth', 'landFront', 'constructionYear', 'floorNumber', 'buildingFloors', 'maintenanceFee', 'latitude', 'longitude'].includes(name);

        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === 'true' ? true : value === 'false' ? false : value }));
    }
    
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
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (fileType === 'image') {
                setImageFiles(prev => [...prev, ...files]);
                // FIX: Cast file to File type for URL.createObjectURL.
                const newPreviews = files.map(file => URL.createObjectURL(file as File));
                setImagePreviews(prev => [...prev, ...newPreviews]);
            } else {
                setVideoFiles(prev => [...prev, ...files]);
                // FIX: Cast file to File type for URL.createObjectURL.
                 const newPreviews = files.map(file => URL.createObjectURL(file as File));
                setVideoPreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };
    
    const removeFile = (index: number, fileType: 'image' | 'video') => {
        if (fileType === 'image') {
            setImageFiles(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            setVideoFiles(prev => prev.filter((_, i) => i !== index));
            setVideoPreviews(prev => prev.filter((_, i) => i !== index));
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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const imagePromises = imageFiles.map(file => fileToDataUrl(file));
            const videoPromises = videoFiles.map(file => fileToDataUrl(file));
            
            const images = await Promise.all(imagePromises);
            const videos = await Promise.all(videoPromises);

            const locationString = `${formData.city}, ${formData.state}`;

            const newProperty: Omit<Property, 'id'> = {
                ...(formData as any), // Cast to any to handle optional number fields
                location: locationString,
                images,
                videos
            };
            
            addProperty(newProperty);
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
                        {formData.operationType === 'Venta' && <InputField label="Precio de Venta (MXN)" name="price" type="number" required value={formData.price} onChange={handleInputChange} />}
                        {formData.operationType?.includes('Renta') && <InputField label="Precio de Renta (MXN)" name="rentPrice" type="number" required value={formData.rentPrice} onChange={handleInputChange} />}
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
                            <InputField label="Recámaras" name="bedrooms" type="number" placeholder="No indicado" value={formData.bedrooms} onChange={handleInputChange} />
                            <InputField label="Baños" name="bathrooms" type="number" placeholder="No indicado" value={formData.bathrooms} onChange={handleInputChange}/>
                            <InputField label="Medios baños" name="halfBathrooms" type="number" placeholder="No indicado" value={formData.halfBathrooms} onChange={handleInputChange}/>
                            <InputField label="Estacionamientos" name="parkingSpaces" type="number" placeholder="No indicado" value={formData.parkingSpaces} onChange={handleInputChange}/>
                            <InputField label="Construcción (m²)" name="constructionArea" type="number" value={formData.constructionArea} onChange={handleInputChange} />
                            <InputField label="Terreno (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                            <InputField label="Fondo (m)" name="landDepth" type="number" value={formData.landDepth} onChange={handleInputChange} />
                            <InputField label="Frente (m)" name="landFront" type="number" value={formData.landFront} onChange={handleInputChange} />
                            <InputField label="Año const." name="constructionYear" type="number" placeholder="No indicado" value={formData.constructionYear} onChange={handleInputChange}/>
                            <InputField label="Piso" name="floorNumber" type="number" placeholder="No indicado" value={formData.floorNumber} onChange={handleInputChange}/>
                            <InputField label="Pisos edif." name="buildingFloors" type="number" placeholder="No indicado" value={formData.buildingFloors} onChange={handleInputChange}/>
                            <InputField label="Mantenim." name="maintenanceFee" type="number" value={formData.maintenanceFee} onChange={handleInputChange} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <InputField label="Clave interna" name="internalKey" placeholder="Ej. DPTO123" value={formData.internalKey} onChange={handleInputChange} />
                            <InputField label="Código de la llave" name="keyLockerCode" placeholder="Ej. C123" value={formData.keyLockerCode} onChange={handleInputChange}/>
                         </div>
                    </fieldset>
                    
                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Ubicación</legend>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                             <InputField label="País" name="country" value="México" onChange={() => {}} />
                             <InputField label="Estado" name="state" required value={formData.state} onChange={handleInputChange} />
                             <InputField label="Ciudad" name="city" required value={formData.city} onChange={handleInputChange} />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <InputField label="Colonia" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} />
                              <InputField label="Código Postal" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <InputField label="Calle" name="street" required value={formData.street} onChange={handleInputChange} />
                            <InputField label="Número" name="streetNumber" value={formData.streetNumber} onChange={handleInputChange} />
                            <InputField label="Interior" name="interiorNumber" value={formData.interiorNumber} onChange={handleInputChange} />
                            <InputField label="Esquina con" name="crossStreet" value={formData.crossStreet} onChange={handleInputChange} />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                             <InputField label="Latitud" name="latitude" type="number" required value={formData.latitude} onChange={handleInputChange} />
                             <InputField label="Longitud" name="longitude" type="number" required value={formData.longitude} onChange={handleInputChange} />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Mostrar ubicación exacta</label>
                             <div className="mt-2 flex space-x-4">
                                <label className="flex items-center"><input type="radio" name="showExactLocation" value="true" checked={formData.showExactLocation === true} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">Sí</span></label>
                                <label className="flex items-center"><input type="radio" name="showExactLocation" value="false" checked={formData.showExactLocation === false} onChange={handleRadioChange} className="radio-style"/> <span className="ml-2">No</span></label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Si eliges no mostrar la ubicación exacta, algunas apps y portales podrían no publicar el anuncio.</p>
                        </div>
                    </fieldset>
                    
                    <fieldset className="p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Amenidades</legend>
                        <div className="space-y-6 mt-4">
                            {Object.entries(AMENITIES_LIST).map(([category, amenities]) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-gray-800 border-b pb-2 mb-3">{category}</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {amenities.map(amenity => (
                                            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="h-4 w-4 text-inverland-green rounded border-gray-300 focus:ring-inverland-green"/>
                                                <span className="text-gray-700 text-sm">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                    
                    <fieldset className="space-y-6 p-4 md:p-6 border rounded-lg">
                        <legend className="text-xl font-bold px-2 text-inverland-dark">Multimedia</legend>
                        <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Imágenes</label>
                            <input type="file" name="images" id="images" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-inverland-green/10 file:text-inverland-green hover:file:bg-inverland-green/20"/>
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg"/>
                                        <button type="button" onClick={() => removeFile(index, 'image')} className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label htmlFor="videos" className="block text-sm font-medium text-gray-700">Videos</label>
                            <input type="file" name="videos" id="videos" multiple accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-inverland-blue/10 file:text-inverland-blue hover:file:bg-inverland-blue/20"/>
                             <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {videoPreviews.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <video src={src} className="w-full h-24 object-cover rounded-lg bg-black"/>
                                        <button type="button" onClick={() => removeFile(index, 'video')} className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
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