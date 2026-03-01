import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Kerala center coordinates
const KERALA_CENTER = [10.8505, 76.2711];
const DEFAULT_ZOOM = 7;

// Dark theme tile layer
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const BaseMap = ({ children, center = KERALA_CENTER, zoom = DEFAULT_ZOOM, className = '', style = {} }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className={className}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', ...style }}
            scrollWheelZoom={true}
            zoomControl={true}
        >
            <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTRIBUTION} />
            {children}
        </MapContainer>
    );
};

// Custom marker icons
export const createIcon = (color = '#22c55e', size = 24) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};

export const MARKER_ICONS = {
    camp: createIcon('#3b82f6', 22),       // Blue
    safehome: createIcon('#22c55e', 20),   // Green
    alert: createIcon('#ef4444', 24),       // Red
    earthquake: createIcon('#f97316', 18),  // Orange
};

export { KERALA_CENTER, DEFAULT_ZOOM };
export default BaseMap;
