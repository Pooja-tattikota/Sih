// alertService.js
// Handles personalized alerts: saving locations, choosing hazard/severity
// preferences, and checking incoming alerts against those preferences.
// Uses localStorage for now — swap the STORAGE_* functions for real API
// calls once Person 6's backend endpoints exist (see mapService.js).

const SAVED_LOCATIONS_KEY = "weathergpt_saved_locations";
const ALERT_PREFS_KEY = "weathergpt_alert_prefs";

const SEVERITY_ORDER = { low: 1, moderate: 2, high: 3 };

// ---------- Saved locations ----------

export function getSavedLocations() {
  try {
    const raw = localStorage.getItem(SAVED_LOCATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocation(location) {
  const current = getSavedLocations();
  const exists = current.some((loc) => loc.id === location.id);
  const updated = exists ? current : [...current, location];
  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeSavedLocation(locationId) {
  const updated = getSavedLocations().filter((loc) => loc.id !== locationId);
  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
  return updated;
}

// ---------- Alert preferences ----------
// Default: notify on all hazard types, moderate severity and above.

const DEFAULT_PREFS = {
  hazardTypes: ["rain", "cyclone", "heatwave", "flood", "storm"],
  minSeverity: "moderate",
};

export function getAlertPreferences() {
  try {
    const raw = localStorage.getItem(ALERT_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setAlertPreferences(prefs) {
  const merged = { ...getAlertPreferences(), ...prefs };
  localStorage.setItem(ALERT_PREFS_KEY, JSON.stringify(merged));
  return merged;
}

// ---------- Filtering & notification logic ----------

/**
 * Given a list of alerts, return only the ones the user cares about
 * based on their saved preferences.
 */
export function filterAlertsByPreference(alerts, prefs = getAlertPreferences()) {
  const minRank = SEVERITY_ORDER[prefs.minSeverity] || 1;

  return alerts.filter((alert) => {
    const severityRank = SEVERITY_ORDER[alert.severity] || 1;
    const hazardMatches = prefs.hazardTypes.includes(alert.hazardType);
    return hazardMatches && severityRank >= minRank;
  });
}

/**
 * Check whether an alert applies to any of the user's saved locations
 * (simple radius check in km using the haversine formula).
 */
export function alertAppliesToSavedLocations(alert, savedLocations, radiusKm = 50) {
  return savedLocations.some((loc) =>
    haversineDistanceKm(loc.latitude, loc.longitude, alert.latitude, alert.longitude) <=
    radiusKm
  );
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/**
 * Trigger a browser notification for a relevant alert, if permission granted.
 * Call requestNotificationPermission() once (e.g. on Settings screen) first.
 */
export function notifyUser(alert) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(alert.title, {
      body: `${alert.region} — ${alert.description}`,
      tag: alert.id,
    });
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}
