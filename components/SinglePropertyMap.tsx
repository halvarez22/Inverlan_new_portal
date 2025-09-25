import React, { useEffect, useRef, useState } from 'react';

// Declare Leaflet's global 'L' object to satisfy TypeScript
declare const L: any;

interface SinglePropertyMapProps {
    lat: number;
    lng: number;
    popupText: string;
}

const SinglePropertyMap: React.FC<SinglePropertyMapProps> = ({ lat, lng, popupText }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // To hold the map instance
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            // Clean up existing map if it exists
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            // Validate coordinates - más estricto para evitar mapas incorrectos
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0 || 
                lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.warn('Invalid coordinates:', { lat, lng });
                setMapError('Coordenadas no configuradas');
                return;
            }

            setMapError(null);

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (mapContainerRef.current && !mapRef.current) {
                    try {
                        // Initialize map with correct coordinates
                        const map = L.map(mapContainerRef.current).setView([lat, lng], 15);
                        
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);

                        // Add marker with exact coordinates
                        const marker = L.marker([lat, lng]).addTo(map);
                        marker.bindPopup(`
                            <div style="text-align: center;">
                                <strong>${popupText}</strong><br>
                                <small>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}</small>
                            </div>
                        `).openPopup();

                        mapRef.current = map;
                    } catch (error) {
                        console.error('Error initializing map:', error);
                        setMapError('Error al cargar el mapa');
                    }
                }
            }, 100);
        }
    }, [lat, lng, popupText]); // Re-run if props change

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    if (mapError) {
        return (
            <div style={{ height: '400px', width: '100%', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p className="text-gray-600 mb-2">⚠️ {mapError}</p>
                <p className="text-sm text-gray-500">Coordenadas: {lat}, {lng}</p>
            </div>
        );
    }

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 0 }} />;
};

export default SinglePropertyMap;
