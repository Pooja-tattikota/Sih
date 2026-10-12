// mapService.js
// Backend integration layer (Person 6's API + Person 3's risk engine).
// Falls back to mock data if the backend call fails or isn't ready yet,
// so the rest of the team can keep building against a stable shape.

import { mockRiskZones, mockAlerts } from "../data/mockRiskData";

// Point this at your actual backend base URL once it's deployed.
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch risk zones for the current map viewport / region.
 * Expected backend response: array of
 * { id, name, latitude, longitude, radiusMeters, riskLevel, hazard }
 */
export async function fetchRiskZones({ latitude, longitude, radiusKm = 100 } = {}) {
  try {
    const params = new URLSearchParams({
      lat: latitude ?? "",
      lng: longitude ?? "",
      radiusKm: radiusKm,
    });

    const response = await fetch(`${API_BASE_URL}/risk-zones?${params}`);
    if (!response.ok) throw new Error("Bad response from risk-zones endpoint");

    return await response.json();
  } catch (error) {
    console.warn("[mapService] Falling back to mock risk zones:", error.message);
    return mockRiskZones;
  }
}

/**
 * Fetch official weather alerts, optionally scoped to a location.
 * Expected backend response: array of alert objects (see mockRiskData.js).
 */
export async function fetchAlerts({ latitude, longitude } = {}) {
  try {
    const params = new URLSearchParams({
      lat: latitude ?? "",
      lng: longitude ?? "",
    });

    const response = await fetch(`${API_BASE_URL}/alerts?${params}`);
    if (!response.ok) throw new Error("Bad response from alerts endpoint");

    return await response.json();
  } catch (error) {
    console.warn("[mapService] Falling back to mock alerts:", error.message);
    return mockAlerts;
  }
}

/**
 * Send the user's current/selected location to the backend, e.g. so
 * Person 6's service can associate it with a session or push targeted
 * alerts later.
 */
export async function sendLocationToBackend(location) {
  try {
    const response = await fetch(`${API_BASE_URL}/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });

    if (!response.ok) throw new Error("Failed to send location to backend");
    return await response.json();
  } catch (error) {
    console.warn("[mapService] Could not sync location with backend:", error.message);
    return null;
  }
}

/**
 * Fetch combined weather + risk data for a specific point, used when a
 * user clicks/taps a spot on the map. Person 3's risk model + weather
 * data are expected to be merged server-side.
 */
export async function fetchPointDetails(latitude, longitude) {
  try {
    const params = new URLSearchParams({ lat: latitude, lng: longitude });
    const response = await fetch(`${API_BASE_URL}/point-details?${params}`);
    if (!response.ok) throw new Error("Bad response from point-details endpoint");
    return await response.json();
  } catch (error) {
    console.warn("[mapService] Falling back to mock point details:", error.message);
    // Minimal mock shape so the UI has something to render
    return {
      latitude,
      longitude,
      riskLevel: "moderate",
      temperature: 29,
      condition: "Partly cloudy",
      hazard: null,
    };
  }
}
