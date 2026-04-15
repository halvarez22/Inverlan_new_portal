import React from 'react';
import { Property } from '../types';
import { useI18n } from './I18nContext';

interface PropertyDatasheetProps {
    property: Property;
    translatedTitle?: string;
    translatedDescription?: string;
}

const PropertyDatasheet: React.FC<PropertyDatasheetProps> = ({ 
    property, 
    translatedTitle, 
    translatedDescription 
}) => {
    const { t, language, translateAmenity } = useI18n();

    const formatDate = () => {
        const locale = language === 'es' ? 'es-MX' : language === 'en' ? 'en-US' : 'zh-CN';
        return new Date().toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        const locale = language === 'es' ? 'es-MX' : language === 'en' ? 'en-US' : 'zh-CN';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Generar URL para código QR (vuelve a la propiedad en el portal)
    const propertyUrl = window.location.href;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(propertyUrl)}`;

    return (
        <div className="datasheet-container bg-white text-gray-900 p-8 max-w-[800px] mx-auto font-sans leading-relaxed">
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b-2 border-inverland-blue pb-6 mb-8">
                <div>
                    <img
                        src="/images/logo.png"
                        alt="Inverland Logo"
                        className="h-16 w-auto object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-bold">{t('datasheet.footer_tagline')}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-inverland-blue">{t('datasheet.title')}</p>
                    <p className="text-xs text-gray-500">{formatDate()}</p>
                    <p className="text-xs font-mono mt-2 bg-gray-100 px-2 py-1 rounded">ID: {property.internalKey || property.id.substring(0, 8).toUpperCase()}</p>
                </div>
            </div>

            {/* Title and Price */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-inverland-dark mb-2 uppercase">{translatedTitle || property.title}</h1>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-600 font-medium">{property.location}</p>
                    <div className="bg-inverland-blue text-white px-6 py-2 rounded-lg text-2xl font-black">
                        {property.operationType.includes('Renta') && property.rentPrice 
                            ? formatCurrency(property.rentPrice) 
                            : formatCurrency(property.price)}
                    </div>
                </div>
            </div>

            {/* Main Photo */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl aspect-[16/9] bg-gray-200">
                <img
                    src={property.images[property.mainPhotoIndex || 0] || 'https://picsum.photos/800/450'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-5 gap-4 mb-10 border-y py-6 border-gray-100">
                <div className="text-center">
                    <p className="text-[24px] mb-1">🛏️</p>
                    <p className="text-sm font-bold">{property.bedrooms}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{t('listings.beds')}</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-[24px] mb-1">🛁</p>
                    <p className="text-sm font-bold">{property.bathrooms}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{t('listings.baths')}</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-[24px] mb-1">🚗</p>
                    <p className="text-sm font-bold">{property.parkingSpaces}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{t('amenity.parking')}</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-[24px] mb-1">📐</p>
                    <p className="text-sm font-bold">{property.constructionArea}m²</p>
                    <p className="text-[10px] text-gray-500 uppercase">{t('detail.area')}</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-[24px] mb-1">📄</p>
                    <p className="text-sm font-bold">{property.type}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{t('detail.type')}</p>
                </div>
            </div>

            {/* Description and Amenities */}
            <div className="grid grid-cols-3 gap-8 mb-10">
                <div className="col-span-2">
                    <h3 className="text-sm font-bold text-inverland-blue uppercase tracking-wider mb-4 border-l-4 border-inverland-blue pl-3">{t('detail.description')}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                        {translatedDescription || property.description}
                    </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="text-sm font-bold text-inverland-blue uppercase tracking-wider mb-4">{t('detail.amenities')}</h3>
                    <ul className="space-y-2">
                        {property.amenities.slice(0, 8).map((amenity, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center">
                                <span className="w-1.5 h-1.5 bg-inverland-green rounded-full mr-2"></span>
                                {translateAmenity(amenity)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer / Contact */}
            <div className="mt-auto pt-8 border-t-2 border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="bg-white p-1 border rounded shadow-sm">
                        <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">{t('datasheet.scan_for_details')}</p>
                        <p className="text-xs text-blue-600 underline">www.inverland.com.mx</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-inverland-dark mb-1">{t('datasheet.contact')}</p>
                    <p className="text-sm text-gray-600">ventas@inverland.com</p>
                    <p className="text-lg font-black text-inverland-blue mt-1">477 123 4567</p>
                </div>
            </div>
            
            {/* Aviso Legal */}
            <p className="text-[8px] text-gray-400 mt-10 text-center uppercase tracking-tighter">
                {t('datasheet.legal_notice')}
            </p>
        </div>
    );
};

export default PropertyDatasheet;
