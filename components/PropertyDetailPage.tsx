import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import SimplePropertyMap from './SimplePropertyMap';
import PropertyDatasheet from './PropertyDatasheet';
import { useI18n } from './I18nContext';
import { translateTextWithGroq } from '../services/groqService';

interface PropertyDetailPageProps {
    property: Property;
    onBack: () => void;
}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ property, onBack }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(property.mainPhotoIndex || 0);
    const { t, language, translateAmenity } = useI18n();
    const [translatedTitle, setTranslatedTitle] = useState(property.title);
    const [translatedDescription, setTranslatedDescription] = useState(property.description);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        const translateContent = async () => {
            if (language === 'es') {
                setTranslatedTitle(property.title);
                setTranslatedDescription(property.description);
                return;
            }

            setIsTranslating(true);
            try {
                const [title, desc] = await Promise.all([
                    translateTextWithGroq(property.title, language),
                    translateTextWithGroq(property.description, language)
                ]);
                setTranslatedTitle(title);
                setTranslatedDescription(desc);
            } catch (error) {
                console.error("Translation failed:", error);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();
    }, [language, property.title, property.description]);
    
    const formatPrice = (price: number) => {
        const locale = language === 'es' ? 'es-MX' : language === 'en' ? 'en-US' : 'zh-CN';
        return new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(price);
    };
    const displayPrice = property.operationType.includes('Renta') && (property.rentPrice ?? 0) > 0
        ? formatPrice(property.rentPrice as number)
        : formatPrice(property.price);

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
        <>
            {/* Contenido Principal (Oculto en impresión) */}
            <section className="py-16 md:py-24 bg-white no-print">
            <div className="container mx-auto px-4 sm:px-6">
                <button onClick={onBack} className="mb-8 text-inverland-blue font-semibold hover:underline flex items-center">
                    <span className="mr-2">&larr;</span> {t('detail.back')}
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Carousel */}
                        <div className="space-y-4">
                            {/* Main Image with Navigation */}
                            <div className="relative group">
                                <img 
                                    src={(() => { const s = property.images[currentImageIndex]; return s && (s.startsWith('http') || s.startsWith('data:')) ? s : 'https://picsum.photos/1200/800?grayscale'; })()} 
                                    alt={translatedTitle} 
                                    className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg" 
                                />
                                
                                {/* Navigation Arrows */}
                                {property.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            aria-label={language === 'es' ? 'Imagen anterior' : language === 'zh' ? '上一张' : 'Previous image'}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            aria-label={language === 'es' ? 'Imagen siguiente' : language === 'zh' ? '下一张' : 'Next image'}
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
                                            src={(img && (img.startsWith('http') || img.startsWith('data:'))) ? img : 'https://picsum.photos/300/200?grayscale'} 
                                            alt={`${translatedTitle} ${index + 1}`} 
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
                            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-inverland-dark ${isTranslating ? 'animate-pulse opacity-50' : ''}`}>
                                {translatedTitle}
                            </h1>
                            <p className="text-lg text-gray-500 mt-2">{property.location}</p>
                            <p className="text-4xl font-bold text-inverland-green mt-4">{displayPrice}</p>
                        </div>
                        
                        {/* Key Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold">{property.bedrooms}</p>
                                <p className="text-gray-600">{t('listings.beds')}</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{property.bathrooms}</p>
                                <p className="text-gray-600">{t('listings.baths')}</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">{property.constructionArea} m²</p>
                                <p className="text-gray-600">{t('detail.area')}</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">{property.type}</p>
                                <p className="text-gray-600">{t('detail.type')}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-inverland-dark">{t('detail.description')}</h3>
                            <div className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${isTranslating ? 'animate-pulse opacity-50' : ''}`}>
                                {translatedDescription}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                             <h3 className="text-2xl font-bold text-inverland-dark mb-4">{t('detail.amenities')}</h3>
                             <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                                {property.amenities.map(amenity => (
                                        <li key={amenity} className="flex items-center">
                                            <svg className="h-5 w-5 text-inverland-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            <span className="text-gray-700 capitalize">{translateAmenity(amenity)}</span>
                                        </li>
                                ))}
                             </ul>
                        </div>
                        
                        {/* Multimedia Section (Native Integration) */}
                        {(property.videos && property.videos.length > 0) || (property.video360 && (Array.isArray(property.video360) ? property.video360.length > 0 : property.video360)) ? (
                            <div className="space-y-10 pt-8 border-t border-gray-100">
                                
                                {/* Recorridos Virtuales 360 (Nativo) */}
                                {property.video360 && (Array.isArray(property.video360) ? property.video360.length > 0 : property.video360) && (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                            <h3 className="text-2xl font-bold text-inverland-dark">{t('detail.virtual_tour')}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8">
                                            {(Array.isArray(property.video360) ? property.video360 : [property.video360]).map((v360, idx) => {
                                                const isKuula = v360.includes('kuula.co');
                                                // Convertir link normal de Kuula a link de share/embed si es necesario
                                                let embedUrl = v360;
                                                if (isKuula && !v360.includes('/share/')) {
                                                    embedUrl = v360.replace('kuula.co/post/', 'kuula.co/share/collection/')
                                                                   .replace('kuula.co/', 'kuula.co/share/collection/');
                                                }
                                                // Agregar parámetros recomendados por Kuula para mejor integración
                                                if (isKuula && !embedUrl.includes('?')) {
                                                    embedUrl += '?fs=1&vr=1&sd=1&thumbs=1&info=1&logo=0';
                                                }

                                                return (
                                                    <div key={idx} className="space-y-3">
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900 ring-1 ring-gray-200">
                                                            {isKuula ? (
                                                                <iframe
                                                                    width="100%"
                                                                    height="100%"
                                                                    style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                                                                    frameBorder="0"
                                                                    allowFullScreen
                                                                    allow="xr-spatial-tracking; gyroscope; accelerometer"
                                                                    scrolling="no"
                                                                    src={embedUrl}
                                                                    title={`Virtual Tour ${idx + 1}`}
                                                                ></iframe>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full flex-col p-6 text-center">
                                                                    <p className="text-white mb-4">{t('detail.view_tour_on_external_site')}</p>
                                                                    <a 
                                                                        href={v360} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                                                                    >
                                                                        {t('detail.view_tour')}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-500 italic flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Recorrido interactivo {idx + 1}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Videos de YouTube (Nativo) */}
                                {property.videos && property.videos.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                                            <h3 className="text-2xl font-bold text-inverland-dark">Videos Presentación</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8">
                                            {property.videos.map((videoUrl, index) => {
                                                 // Extracción robusta de ID de YouTube (incluyendo Shorts y parámetros extras)
                                                 const getYoutubeId = (url: string) => {
                                                     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
                                                     const match = url.match(regExp);
                                                     return (match && match[2].length === 11) ? match[2] : null;
                                                 };
                                                 const videoId = getYoutubeId(videoUrl);

                                                return (
                                                    <div key={index} className="space-y-3">
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900 ring-1 ring-gray-200">
                                                            {videoId ? (
                                                                <iframe
                                                                    width="100%"
                                                                    height="100%"
                                                                     src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                                                    title={`YouTube video ${index + 1}`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                                                ></iframe>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full flex-col p-6 text-center">
                                                                    <a 
                                                                        href={videoUrl} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg"
                                                                    >
                                                                        {t('detail.watch_youtube')}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-gray-500 italic flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                                                                </svg>
                                                                Video de presentación {index + 1}
                                                            </p>
                                                            {videoId && (
                                                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wider">
                                                                    YouTube Nativo
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        
                        {/* Location Map */}
                        <div>
                            <h3 className="text-2xl font-bold text-inverland-dark mb-4">{t('detail.location')}</h3>
                            <SimplePropertyMap 
                                lat={property.latitude} 
                                lng={property.longitude} 
                                popupText={translatedTitle}
                            />
                        </div>
                    </div>

                    {/* Contact/Agent Sidebar */}
                    <aside className="lg:col-span-1 self-start lg:sticky top-28">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-inverland-dark mb-4">{t('detail.interested')}</h3>
                            <p className="text-gray-600 mb-6">{t('detail.interested_text')}</p>
                             <form className="space-y-4">
                                <div>
                                    <label htmlFor="contact-name" className="sr-only">{t('contact.name')}</label>
                                    <input type="text" id="contact-name" placeholder={t('contact.name')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green bg-white text-gray-800"/>
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="sr-only">{t('contact.email')}</label>
                                    <input type="email" id="contact-email" placeholder={t('contact.email')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green bg-white text-gray-800"/>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-inverland-green text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-transform transform hover:scale-105">
                                        {t('detail.request_info')}
                                    </button>
                                </div>
                             </form>

                              {/* Botón de Descargar Ficha */}
                              <div className="mt-8 pt-6 border-t border-gray-200">
                                  <button 
                                      onClick={() => window.print()} 
                                      className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-inverland-blue text-inverland-blue font-bold py-3 px-4 rounded-xl hover:bg-inverland-blue hover:text-white transition-all duration-300 group"
                                  >
                                      <svg className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span>{t('detail.download_datasheet')}</span>
                                  </button>
                                  <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-wider font-medium">{t('detail.download_datasheet_info')}</p>
                              </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        {/* Vista de Impresión (Solo visible al imprimir) */}
        <div className="print-only">
            <PropertyDatasheet 
                property={property} 
                translatedTitle={translatedTitle}
                translatedDescription={translatedDescription}
            />
        </div>
    </>
    );
};

export default PropertyDetailPage;