import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
// https://react-leaflet.js.org/docs/example-popup-marker/
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for venues (orange to match brand)
const venueIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
      <path fill="#FF6B35" stroke="#FFF" stroke-width="2" d="M12 0C7.031 0 3 4.031 3 9c0 6.75 9 19 9 19s9-12.25 9-19c0-4.969-4.031-9-9-9z"/>
      <circle cx="12" cy="9" r="4" fill="#FFF"/>
    </svg>
  `),
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
});

// Component to recenter map when coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

/**
 * VenueMap Component
 *
 * Interactive map showing venue location(s)
 *
 * Props:
 * - latitude: Venue latitude
 * - longitude: Venue longitude
 * - venueName: Name for popup
 * - address: Address for popup
 * - zoom: Map zoom level (default: 15)
 * - height: Map height in pixels (default: 400)
 * - showPopup: Show popup by default (default: true)
 */
export default function VenueMap({
  latitude,
  longitude,
  venueName,
  address,
  zoom = 15,
  height = 400,
  showPopup = true,
}) {
  if (!latitude || !longitude) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">Map unavailable - No location data</p>
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: `${height}px`, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={venueIcon}>
          {showPopup && (
            <Popup>
              <div className="text-sm">
                <strong className="block mb-1">{venueName}</strong>
                {address && <p className="text-gray-600 text-xs">{address}</p>}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-xs font-medium mt-2 inline-block"
                >
                  Get Directions →
                </a>
              </div>
            </Popup>
          )}
        </Marker>
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
