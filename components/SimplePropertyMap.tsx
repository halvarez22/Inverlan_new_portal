import React from 'react';

interface SimplePropertyMapProps {
    lat: number;
    lng: number;
    popupText: string;
}

const SimplePropertyMap: React.FC<SimplePropertyMapProps> = ({ lat, lng, popupText }) => {
    // DEBUG: Mostrar coordenadas ANTES de validación
    console.log('🔍 SimplePropertyMap recibió:', { lat, lng, popupText });
    console.log('🔍 Tipos:', { latType: typeof lat, lngType: typeof lng });
    console.log('🔍 Validaciones:', { 
        isNaN_lat: isNaN(lat), 
        isNaN_lng: isNaN(lng), 
        lat_zero: lat === 0, 
        lng_zero: lng === 0,
        lat_range: lat < -90 || lat > 90,
        lng_range: lng < -180 || lng > 180
    });
    
    // Validate coordinates - más estricto para evitar mapas incorrectos
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0 || 
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return (
            <div style={{ height: '400px', width: '100%', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p className="text-gray-600 mb-2">📍 Coordenadas no configuradas</p>
                <p className="text-sm text-gray-500">Esta propiedad necesita coordenadas válidas para mostrar el mapa</p>
                <p className="text-xs text-gray-400 mt-2">Lat: {lat}, Lng: {lng}</p>
            </div>
        );
    }

    // Create OpenStreetMap URL (no API key required)
    // PRUEBA: Usar formato estándar de OpenStreetMap
    // Para México: León (21.1098, -101.6878) debe mostrar León, Guanajuato
    
    // DEBUG: Mostrar coordenadas en consola
    console.log('Mapa coordenadas:', { lat, lng, popupText });
    console.log('URL generada:', `bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&marker=${lat},${lng}`);
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${popupText}`}
            />
            <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                right: '10px', 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                padding: '8px', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                📍 {popupText}<br/>
                Lat: {lat.toFixed(6)}<br/>
                Lng: {lng.toFixed(6)}
            </div>
            <div style={{ 
                position: 'absolute', 
                top: '10px', 
                left: '10px', 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '10px',
                color: '#666',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                🗺️ OpenStreetMap
            </div>
        </div>
    );
};

export default SimplePropertyMap;
