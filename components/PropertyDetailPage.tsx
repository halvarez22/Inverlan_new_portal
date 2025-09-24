import React, { useState } from 'react';
import { Property } from '../types';
import SinglePropertyMap from './SinglePropertyMap';

interface PropertyDetailPageProps {
    property: Property;
    onBack: () => void;
}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ property, onBack }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(property.mainPhotoIndex || 0);
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

    const selectImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                <button onClick={onBack} className="mb-8 text-inverland-blue font-semibold hover:underline">
                    &larr; Volver a la lista
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Carousel */}
                        <div className="space-y-4">
                            {/* Main Image with Navigation */}
                            <div className="relative group">
                                <img 
                                    src={property.images[currentImageIndex] || 'https://picsum.photos/1200/800?grayscale'} 
                                    alt={property.title} 
                                    className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg" 
                                />
                                
                                {/* Navigation Arrows */}
                                {property.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            aria-label="Imagen anterior"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            aria-label="Imagen siguiente"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                                
                                {/* Image Counter */}
                                {property.images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {property.images.length}
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnail Gallery */}
                            {property.images.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                    {property.images.map((img, index) => (
                                        <img 
                                            key={index} 
                                            src={img} 
                                            alt={`${property.title} ${index + 1}`} 
                                            className={`w-full h-16 sm:h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                                                index === currentImageIndex 
                                                    ? 'ring-2 ring-inverland-blue ring-opacity-75 shadow-md' 
                                                    : 'hover:opacity-80 hover:shadow-sm'
                                            }`}
                                            onClick={() => selectImage(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title and Price */}
                        <div className="border-b pb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-inverland-dark">{property.title}</h1>
                            <p className="text-lg text-gray-500 mt-2">{property.location}</p>
                            <p className="text-4xl font-bold text-inverland-green mt-4">{formatPrice(property.price)}</p>
                        </div>
                        
                        {/* Key Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold">{property.bedrooms}</p>
                                <p className="text-gray-600">Habitaciones</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{property.bathrooms}</p>
                                <p className="text-gray-600">Baños</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">{property.constructionArea} m²</p>
                                <p className="text-gray-600">Superficie</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">{property.type}</p>
                                <p className="text-gray-600">Tipo</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                             <h3 className="text-2xl font-bold text-inverland-dark mb-4">Amenidades</h3>
                             <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                                {property.amenities.map(amenity => (
                                    <li key={amenity} className="flex items-center">
                                        <svg className="h-5 w-5 text-inverland-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-gray-700 capitalize">{amenity}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                        
                        {/* Location Map */}
                        <div>
                            <h3 className="text-2xl font-bold text-inverland-dark mb-4">Ubicación</h3>
                            <SinglePropertyMap 
                                lat={property.latitude} 
                                lng={property.longitude} 
                                popupText={property.title}
                            />
                        </div>
                    </div>

                    {/* Contact/Agent Sidebar */}
                    <aside className="lg:col-span-1 self-start lg:sticky top-28">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-inverland-dark mb-4">¿Interesado?</h3>
                            <p className="text-gray-600 mb-6">Contacta a un asesor para agendar una visita o recibir más información.</p>
                             <form className="space-y-4">
                                <div>
                                    <label htmlFor="contact-name" className="sr-only">Nombre</label>
                                    <input type="text" id="contact-name" placeholder="Tu nombre" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green bg-white text-gray-800"/>
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="sr-only">Email</label>
                                    <input type="email" id="contact-email" placeholder="Tu email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green bg-white text-gray-800"/>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-inverland-green text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-transform transform hover:scale-105">
                                        Solicitar Información
                                    </button>
                                </div>
                             </form>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default PropertyDetailPage;