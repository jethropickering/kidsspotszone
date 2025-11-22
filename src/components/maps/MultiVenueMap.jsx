import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin, FiStar } from 'react-icons/fi';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for venues
const createVenueIcon = (isSelected = false) => {
  const color = isSelected ? '#F7931E' : '#FF6B35';
  const size = isSelected ? [35, 52] : [30, 45];

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${size[0]}" height="${size[1]}">
        <path fill="${color}" stroke="#FFF" stroke-width="2" d="M12 0C7.031 0 3 4.031 3 9c0 6.75 9 19 9 19s9-12.25 9-19c0-4.969-4.031-9-9-9z"/>
        <circle cx="12" cy="9" r="4" fill="#FFF"/>
      </svg>
    `),
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]],
  });
};

// Component to fit bounds to show all markers
function FitBounds({ venues }) {
  const map = useMap();

  useEffect(() => {
    if (venues.length === 0) return;

    if (venues.length === 1) {
      // Single venue - center on it
      const { latitude, longitude } = venues[0];
      if (latitude && longitude) {
        map.setView([latitude, longitude], 13);
      }
    } else {
      // Multiple venues - fit bounds
      const validVenues = venues.filter(v => v.latitude && v.longitude);
      if (validVenues.length > 0) {
        const bounds = validVenues.map(v => [v.latitude, v.longitude]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [venues, map]);

  return null;
}

/**
 * MultiVenueMap Component
 *
 * Shows multiple venues on an interactive map
 * Used for search results, category pages, and city pages
 *
 * Props:
 * - venues: Array of venue objects with latitude, longitude, name, slug, etc.
 * - height: Map height in pixels (default: 500)
 * - center: Default center if no venues (default: Sydney)
 * - zoom: Default zoom level (default: 11)
 * - selectedVenueId: ID of currently selected venue (to highlight)
 * - onVenueClick: Callback when venue marker is clicked
 */
export default function MultiVenueMap({
  venues = [],
  height = 500,
  center = [-33.8688, 151.2093], // Sydney
  zoom = 11,
  selectedVenueId = null,
  onVenueClick = null,
}) {
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Filter out venues without coordinates
  const validVenues = venues.filter(v => v.latitude && v.longitude);

  if (validVenues.length === 0) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex flex-col items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <FiMapPin className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-600 font-medium">No venues to display on map</p>
        <p className="text-sm text-gray-500 mt-1">Venues will appear here once locations are added</p>
      </div>
    );
  }

  const handleMarkerClick = (venue) => {
    setSelectedVenue(venue);
    if (onVenueClick) {
      onVenueClick(venue);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: `${height}px`, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validVenues.map((venue) => {
          const isSelected = venue.id === selectedVenueId || venue.id === selectedVenue?.id;

          return (
            <Marker
              key={venue.id}
              position={[venue.latitude, venue.longitude]}
              icon={createVenueIcon(isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(venue),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  {/* Venue Name */}
                  <Link
                    to={`/venue/${venue.slug}`}
                    className="font-bold text-primary-600 hover:text-primary-700 block mb-1"
                  >
                    {venue.name}
                  </Link>

                  {/* Rating */}
                  {venue.average_rating && (
                    <div className="flex items-center gap-1 text-sm mb-2">
                      <FiStar className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{venue.average_rating.toFixed(1)}</span>
                      {venue.review_count > 0 && (
                        <span className="text-gray-500">({venue.review_count})</span>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  {venue.suburb && (
                    <p className="text-xs text-gray-600 mb-2">
                      {venue.suburb}, {venue.state}
                    </p>
                  )}

                  {/* Categories */}
                  {venue.categories && venue.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Link
                      to={`/venue/${venue.slug}`}
                      className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded hover:bg-primary-600 transition-colors inline-block text-center flex-1"
                    >
                      View Details
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors inline-block text-center"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds venues={validVenues} />
      </MapContainer>
    </div>
  );
}
