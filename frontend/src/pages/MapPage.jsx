// import React from 'react';
// MapPage.jsx
// Person 4's main screen: ties together location detection/search,
// the risk map, official alerts, and personalized alert preferences.
//
//   User Location → Interactive Map → Weather + Risk Layers
//   → Official Warnings → Personalized Alerts
import React from 'react';
import { useEffect, useState, useCallback } from "react";
import WeatherMap from "../components/Maps/WeatherMap";
import AlertBanner from "../components/Alerts/AlertBanner";
import AlertList from "../components/Alerts/AlertList";
import {
  getCurrentLocation,
  searchCity,
  reverseGeocode,
  buildLocation,
} from "../services/locationService";
import { fetchRiskZones, fetchAlerts, sendLocationToBackend } from "../services/mapService";
import {
  getSavedLocations,
  saveLocation,
  removeSavedLocation,
  filterAlertsByPreference,
  requestNotificationPermission,
} from "../services/alertService";
import "./MapPage.css";

export default function MapPage() {
  const [location, setLocation] = useState(null); // active location shown on map
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved locations once on mount
  useEffect(() => {
    setSavedLocations(getSavedLocations());
    requestNotificationPermission();
  }, []);

  // Detect user's location on first load
  useEffect(() => {
    detectMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the active location changes, refresh map + alert data
  useEffect(() => {
    if (!location) return;

    let cancelled = false;

    async function loadForLocation() {
      setLoading(true);
      setError(null);
      try {
        const [zones, allAlerts] = await Promise.all([
          fetchRiskZones({ latitude: location.latitude, longitude: location.longitude }),
          fetchAlerts({ latitude: location.latitude, longitude: location.longitude }),
        ]);

        if (cancelled) return;
        setRiskZones(zones);
        setAlerts(filterAlertsByPreference(allAlerts));

        sendLocationToBackend(location);
      } catch (err) {
        if (!cancelled) setError("Couldn't load weather/risk data. Showing best available.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadForLocation();
    return () => {
      cancelled = true;
    };
  }, [location]);

  const detectMyLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentLocation();
      const place = await reverseGeocode(coords.latitude, coords.longitude);
      setLocation(
        buildLocation({
          name: place.name,
          country: place.country,
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await searchCity(value);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (result) => {
    setLocation(buildLocation(result));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSaveCurrentLocation = () => {
    if (!location) return;
    setSavedLocations(saveLocation(location));
  };

  const handleRemoveSaved = (id) => {
    setSavedLocations(removeSavedLocation(id));
  };

  return (
    <div className="map-page">
      <AlertBanner alerts={alerts} />

      <div className="map-page-header">
        <h1>Weather Risk Map</h1>

        <div className="map-page-search">
          <input
            type="text"
            placeholder="Search a city..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={detectMyLocation} disabled={loading}>
            📍 Use my location
          </button>

          {searchResults.length > 0 && (
            <ul className="map-page-search-results">
              {searchResults.map((result) => (
                <li key={result.id} onClick={() => handleSelectSearchResult(result)}>
                  {result.name}
                  {result.admin1 ? `, ${result.admin1}` : ""}
                  {result.country ? `, ${result.country}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        {location && (
          <div className="map-page-current-location">
            Showing: <strong>{location.name}</strong>
            {location.country ? `, ${location.country}` : ""}
            <button onClick={handleSaveCurrentLocation}>★ Save</button>
          </div>
        )}

        {error && <p className="map-page-error">{error}</p>}
      </div>

      <div className="map-page-body">
        <div className="map-page-map">
          <WeatherMap userLocation={location} riskZones={riskZones} />
        </div>

        <div className="map-page-sidebar">
          <h3>Active Warnings</h3>
          <AlertList alerts={alerts} />

          {savedLocations.length > 0 && (
            <div className="map-page-saved">
              <h3>Saved Locations</h3>
              <ul>
                {savedLocations.map((loc) => (
                  <li key={loc.id}>
                    <button onClick={() => setLocation(loc)}>{loc.name}</button>
                    <button
                      className="map-page-remove-btn"
                      onClick={() => handleRemoveSaved(loc.id)}
                      aria-label={`Remove ${loc.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}