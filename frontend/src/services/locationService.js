// locationService.js
// Handles: browser geolocation, city search (geocoding), and lat/lng helpers.
// Uses Open-Meteo's free geocoding API — no API key required.
// Swap BASE_GEOCODE_URL for your own backend endpoint if Person 6 provides one.

const BASE_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/reverse";

/**
 * Get the user's current position using the browser Geolocation API.
 * Returns { latitude, longitude, accuracy }.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(mapGeoError(error)));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

function mapGeoError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission denied. Please enable it in your browser settings.";
    case error.POSITION_UNAVAILABLE:
      return "Location information is unavailable right now.";
    case error.TIMEOUT:
      return "Location request timed out.";
    default:
      return "Unable to retrieve your location.";
  }
}

/**
 * Search for a city/place by name.
 * Returns an array of { name, country, admin1, latitude, longitude }.
 */
export async function searchCity(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${BASE_GEOCODE_URL}?name=${encodeURIComponent(
    query
  )}&count=8&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("City search failed. Please try again.");
  }

  const data = await response.json();

  return (data.results || []).map((place) => ({
    id: `${place.id}`,
    name: place.name,
    country: place.country,
    admin1: place.admin1 || "",
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}

/**
 * Reverse geocode coordinates into a readable place name.
 * Useful right after getCurrentLocation() to label the map.
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const name = data.city || data.locality || data.principalSubdivision || "Current location";
      const country = data.countryName || "";
      return { name, country };
    }
  } catch (err) {
    console.warn("Reverse geocode failed:", err);
  }

  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(nomUrl, { headers: { "User-Agent": "WeatherGPT/1.0" } });
    if (response.ok) {
      const data = await response.json();
      const name = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Current location";
      const country = data.address?.country || "";
      return { name, country };
    }
  } catch (err) {
    console.warn("Fallback reverse geocode failed:", err);
  }

  return { name: "Current location", country: "" };
}

/**
 * Small helper to build a consistent "location object" shape
 * used across the app (map, alerts, saved locations).
 */
export function buildLocation({ name, country = "", latitude, longitude }) {
  return {
    id: `${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name,
    country,
    latitude,
    longitude,
  };
}
