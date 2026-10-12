// mockRiskData.js
// Placeholder risk data so Maps/Alerts UI can be built and demoed
// before Person 3's real risk-scoring model and Person 6's backend
// endpoints are wired in. Shape should match what mapService.js expects
// to receive from the backend.

// Risk levels: "low" | "moderate" | "high"
export const RISK_COLORS = {
  low: "#2ecc71",
  moderate: "#f1c40f",
  high: "#e74c3c",
};

export const RISK_LABELS = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

// Sample risk zones (lat/lng + radius in meters + risk level)
export const mockRiskZones = [
  {
    id: "zone-1",
    name: "Hyderabad Central",
    latitude: 17.385,
    longitude: 78.4867,
    radiusMeters: 8000,
    riskLevel: "moderate",
    hazard: "Heavy Rain",
  },
  {
    id: "zone-2",
    name: "Coastal Andhra Belt",
    latitude: 15.9,
    longitude: 80.6,
    radiusMeters: 25000,
    riskLevel: "high",
    hazard: "Cyclone",
  },
  {
    id: "zone-3",
    name: "Vidarbha Plains",
    latitude: 20.9,
    longitude: 78.5,
    radiusMeters: 20000,
    riskLevel: "low",
    hazard: "Heatwave",
  },
];

// Sample official-style alerts (shape mirrors what alertService expects)
export const mockAlerts = [
  {
    id: "alert-1",
    title: "Heavy Rainfall Warning",
    severity: "moderate",
    hazardType: "rain",
    region: "Hyderabad & surrounding districts",
    issuedBy: "IMD",
    issuedAt: "2026-08-29T06:00:00Z",
    validUntil: "2026-08-30T18:00:00Z",
    description:
      "Moderate to heavy rainfall expected over the next 36 hours. Localized flooding possible in low-lying areas.",
  },
  {
    id: "alert-2",
    title: "Cyclone Watch",
    severity: "high",
    hazardType: "cyclone",
    region: "Coastal Andhra Pradesh",
    issuedBy: "IMD",
    issuedAt: "2026-08-29T03:00:00Z",
    validUntil: "2026-09-01T00:00:00Z",
    description:
      "A depression over the Bay of Bengal is likely to intensify. Fishermen advised not to venture into the sea.",
  },
  {
    id: "alert-3",
    title: "Heatwave Advisory",
    severity: "low",
    hazardType: "heatwave",
    region: "Vidarbha, Maharashtra",
    issuedBy: "IMD",
    issuedAt: "2026-08-28T05:00:00Z",
    validUntil: "2026-08-30T05:00:00Z",
    description:
      "Day temperatures likely to remain 2-3°C above normal. Avoid prolonged sun exposure between 12 PM - 4 PM.",
  },
];
