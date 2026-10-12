// import React from 'react';
// WeatherMap.jsx
// Core interactive map. Renders the base map, the user's location marker,
// and the risk layer on top. Clicking a point fetches point-level detail.
//
// Requires: npm install leaflet react-leaflet
// Also import "leaflet/dist/leaflet.css" once globally (e.g. in main.jsx).
import React from 'react';
import { useState, useCallback } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import RiskLayer from "./RiskLayer";
import { fetchPointDetails } from "../../services/mapService";
import "./WeatherMap.css";

const DEFAULT_CENTER = [17.385, 78.4867]; // Hyderabad, fallback center
const DEFAULT_ZOOM = 6;

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function WeatherMap({
  userLocation, // { latitude, longitude, name? } | null
  riskZones = [], // array from mapService.fetchRiskZones
  center,
  zoom = DEFAULT_ZOOM,
  onPointSelect, // optional callback(pointDetails)
}) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loadingPoint, setLoadingPoint] = useState(false);

  const mapCenter = center || (userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : DEFAULT_CENTER);

  const handleMapClick = useCallback(
    async (latlng) => {
      setLoadingPoint(true);
      try {
        const details = await fetchPointDetails(latlng.lat, latlng.lng);
        setSelectedPoint(details);
        onPointSelect?.(details);
      } finally {
        setLoadingPoint(false);
      }
    },
    [onPointSelect]
  );

  return (
    <div className="weather-map-wrapper">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        className="weather-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={handleMapClick} />

        {userLocation && <LocationMarker location={userLocation} />}

        <RiskLayer zones={riskZones} />
      </MapContainer>

      {loadingPoint && (
        <div className="weather-map-toast">Fetching conditions…</div>
      )}

      {selectedPoint && !loadingPoint && (
        <div className="weather-map-toast">
          <strong>{selectedPoint.condition || "Conditions"}</strong>
          {typeof selectedPoint.temperature === "number" && (
            <span> — {selectedPoint.temperature}°C</span>
          )}
          <button
            className="weather-map-toast-close"
            onClick={() => setSelectedPoint(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}