// src/components/InteractiveMap.tsx
import React, { memo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BakehausLocation {
  id: number;
  city: string;
  country: string;
  coordinates: [number, number];
  address: string;
  phone: string;
  hours: string;
  established: string;
}

const locations: Record<string, BakehausLocation[]> = {
  es: [
    {
      id: 1,
      city: 'Nueva York',
      country: 'Estados Unidos',
      coordinates: [40.7128, -74.0060],
      address: '123 Manhattan Ave, New York, NY 10001',
      phone: '+1 (212) 555-0123',
      hours: 'Lun-Vie: 6:00-20:00, Sáb: 6:00-22:00, Dom: 7:00-18:00',
      established: '1965'
    },
    {
      id: 2,
      city: 'Los Ángeles',
      country: 'Estados Unidos',
      coordinates: [34.0522, -118.2437],
      address: '456 Hollywood Blvd, Los Angeles, CA 90028',
      phone: '+1 (323) 555-0456',
      hours: 'Lun-Dom: 6:00-21:00',
      established: '2010'
    },
    {
      id: 3,
      city: 'Chicago',
      country: 'Estados Unidos',
      coordinates: [41.8781, -87.6298],
      address: '789 Michigan Ave, Chicago, IL 60611',
      phone: '+1 (312) 555-0789',
      hours: 'Lun-Vie: 6:30-19:30, Sáb-Dom: 7:00-20:00',
      established: '2012'
    },
    {
      id: 4,
      city: 'Honolulu',
      country: 'Estados Unidos',
      coordinates: [21.3099, -157.8581],
      address: '321 Kalakaua Ave, Honolulu, HI 96815',
      phone: '+1 (808) 555-0321',
      hours: 'Lun-Dom: 7:00-19:00',
      established: '2015'
    },
    {
      id: 5,
      city: 'México',
      country: 'México',
      coordinates: [19.4326, -99.1332],
      address: 'Av. Reforma 654, Ciudad de México, CDMX',
      phone: '+52 55 5555-0654',
      hours: 'Lun-Vie: 6:00-20:00, Sáb-Dom: 7:00-21:00',
      established: '2016'
    },
    {
      id: 6,
      city: 'Seúl',
      country: 'Corea del Sur',
      coordinates: [37.5665, 126.9780],
      address: '87 Gangnam-gu, Seoul, South Korea',
      phone: '+82 2-555-0987',
      hours: 'Lun-Dom: 6:00-22:00',
      established: '2018'
    },
    {
      id: 7,
      city: 'Tokio',
      country: 'Japón',
      coordinates: [35.6762, 139.6503],
      address: '12-3 Shibuya, Tokyo, Japan',
      phone: '+81 3-5555-0123',
      hours: 'Lun-Dom: 6:00-21:00',
      established: '2019'
    },
    {
      id: 8,
      city: 'Moscú',
      country: 'Rusia',
      coordinates: [55.7558, 37.6176],
      address: 'Tverskaya St, 45, Moscow, Russia',
      phone: '+7 495 555-0456',
      hours: 'Lun-Dom: 7:00-20:00',
      established: '2020'
    },
    {
      id: 9,
      city: 'Dubai',
      country: 'Emiratos Árabes Unidos',
      coordinates: [25.2048, 55.2708],
      address: 'Sheikh Zayed Rd, Dubai, UAE',
      phone: '+971 4-555-0789',
      hours: 'Sáb-Jue: 6:00-22:00, Vie: 14:00-22:00',
      established: '2021'
    },
    {
      id: 10,
      city: 'Doha',
      country: 'Qatar',
      coordinates: [25.2854, 51.5310],
      address: 'Corniche St, Doha, Qatar',
      phone: '+974 4455-5012',
      hours: 'Sáb-Jue: 6:00-21:00, Vie: 14:00-21:00',
      established: '2022'
    }
  ],
  en: [
    {
      id: 1,
      city: 'New York',
      country: 'United States',
      coordinates: [40.7128, -74.0060],
      address: '123 Manhattan Ave, New York, NY 10001',
      phone: '+1 (212) 555-0123',
      hours: 'Mon-Fri: 6:00-20:00, Sat: 6:00-22:00, Sun: 7:00-18:00',
      established: '1965'
    },
    {
      id: 2,
      city: 'Los Angeles',
      country: 'United States',
      coordinates: [34.0522, -118.2437],
      address: '456 Hollywood Blvd, Los Angeles, CA 90028',
      phone: '+1 (323) 555-0456',
      hours: 'Mon-Sun: 6:00-21:00',
      established: '2010'
    },
    {
      id: 3,
      city: 'Chicago',
      country: 'United States',
      coordinates: [41.8781, -87.6298],
      address: '789 Michigan Ave, Chicago, IL 60611',
      phone: '+1 (312) 555-0789',
      hours: 'Mon-Fri: 6:30-19:30, Sat-Sun: 7:00-20:00',
      established: '2012'
    },
    {
      id: 4,
      city: 'Honolulu',
      country: 'United States',
      coordinates: [21.3099, -157.8581],
      address: '321 Kalakaua Ave, Honolulu, HI 96815',
      phone: '+1 (808) 555-0321',
      hours: 'Mon-Sun: 7:00-19:00',
      established: '2015'
    },
    {
      id: 5,
      city: 'Mexico City',
      country: 'Mexico',
      coordinates: [19.4326, -99.1332],
      address: 'Av. Reforma 654, Ciudad de México, CDMX',
      phone: '+52 55 5555-0654',
      hours: 'Mon-Fri: 6:00-20:00, Sat-Sun: 7:00-21:00',
      established: '2016'
    },
    {
      id: 6,
      city: 'Seoul',
      country: 'South Korea',
      coordinates: [37.5665, 126.9780],
      address: '87 Gangnam-gu, Seoul, South Korea',
      phone: '+82 2-555-0987',
      hours: 'Mon-Sun: 6:00-22:00',
      established: '2018'
    },
    {
      id: 7,
      city: 'Tokyo',
      country: 'Japan',
      coordinates: [35.6762, 139.6503],
      address: '12-3 Shibuya, Tokyo, Japan',
      phone: '+81 3-5555-0123',
      hours: 'Mon-Sun: 6:00-21:00',
      established: '2019'
    },
    {
      id: 8,
      city: 'Moscow',
      country: 'Russia',
      coordinates: [55.7558, 37.6176],
      address: 'Tverskaya St, 45, Moscow, Russia',
      phone: '+7 495 555-0456',
      hours: 'Mon-Sun: 7:00-20:00',
      established: '2020'
    },
    {
      id: 9,
      city: 'Dubai',
      country: 'United Arab Emirates',
      coordinates: [25.2048, 55.2708],
      address: 'Sheikh Zayed Rd, Dubai, UAE',
      phone: '+971 4-555-0789',
      hours: 'Sat-Thu: 6:00-22:00, Fri: 14:00-22:00',
      established: '2021'
    },
    {
      id: 10,
      city: 'Doha',
      country: 'Qatar',
      coordinates: [25.2854, 51.5310],
      address: 'Corniche St, Doha, Qatar',
      phone: '+974 4455-5012',
      hours: 'Sat-Thu: 6:00-21:00, Fri: 14:00-21:00',
      established: '2022'
    }
  ]
};

interface InteractiveMapProps {
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = memo(({ className = "" }) => {
  const { i18n } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const currentLocations = locations[i18n.language as 'es' | 'en'] || locations.es;

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleMapReady = () => {
    if (mapRef.current) {
      const container = mapRef.current.getContainer();
      container.style.outline = 'none';
      mapRef.current.invalidateSize();
    }
  };

  return (
    <div 
      ref={mapContainerRef}
      className={`w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 ${className}`}
      style={{ 
        position: 'relative',
        isolation: 'isolate'
      }}
      onWheel={(e) => {
        // Permitir zoom con Ctrl + scroll, bloquear scroll normal
        if (!e.ctrlKey) {
          e.preventDefault();
        }
      }}
    >
      <MapContainer
        ref={mapRef}
        center={[30, 0]}
        zoom={2}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        dragging={true}
        style={{ 
          height: '100%', 
          width: '100%',
          zIndex: 1
        }}
        whenReady={handleMapReady}
        key={i18n.language}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {currentLocations.map((location) => (
          <Marker
            key={`${location.id}-${i18n.language}`}
            position={location.coordinates}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg text-zinc-900 mb-2">
                  BAKEHAUS {location.city}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-neutral-600">
                    <span className="font-semibold">
                      {i18n.language === 'es' ? 'Establecido:' : 'Established:'} 
                    </span> {location.established}
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-semibold">
                      {i18n.language === 'es' ? 'Dirección:' : 'Address:'} 
                    </span> {location.address}
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-semibold">
                      {i18n.language === 'es' ? 'Teléfono:' : 'Phone:'} 
                    </span> {location.phone}
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-semibold">
                      {i18n.language === 'es' ? 'Horarios:' : 'Hours:'} 
                    </span> {location.hours}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});