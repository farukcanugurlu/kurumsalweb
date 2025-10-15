import React from 'react';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  address?: string;
  height?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom, address, height = 300 }) => {
  // Google Maps Embed - tamamen ücretsiz, API key gerektirmiyor
  const mapUrl = `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}&output=embed`;

  return (
    <div style={{ height: height, borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Konum Haritası"
      />
    </div>
  );
};

export default GoogleMap;
