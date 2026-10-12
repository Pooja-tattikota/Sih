
// import React from 'react';
// // AlertBanner.jsx
// // A dismissible banner that surfaces the single most severe active alert
// // at the top of the screen — for the "can't miss this" warnings.

// import { useMemo, useState } from "react";
// import { RISK_COLORS } from "../../data/mockRiskData";
// import "./Alerts.css";

// const SEVERITY_ORDER = { high: 3, moderate: 2, low: 1 };

// export default function AlertBanner({ alerts = [] }) {
//   const [dismissedIds, setDismissedIds] = useState([]);

//   const topAlert = useMemo(() => {
//     const active = alerts.filter((a) => !dismissedIds.includes(a.id));
//     if (active.length === 0) return null;

//     return [...active].sort(
//       (a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
//     )[0];
//   }, [alerts, dismissedIds]);

//   if (!topAlert) return null;

//   const color = RISK_COLORS[topAlert.severity] || RISK_COLORS.moderate;

//   return (
//     <div className="alert-banner" style={{ backgroundColor: color }}>
//       <span className="alert-banner-icon" aria-hidden="true">
//         ⚠
//       </span>
//       <div className="alert-banner-text">
//         <strong>{topAlert.title}</strong> — {topAlert.region}
//       </div>
//       <button
//         className="alert-banner-close"
//         onClick={() => setDismissedIds((prev) => [...prev, topAlert.id])}
//         aria-label="Dismiss alert"
//       >
//         ×
//       </button>
//     </div>
//   );
// }
import React from 'react';
// AlertBanner.jsx
// A dismissible banner that surfaces the single most severe active alert
// at the top of the screen — for the "can't miss this" warnings.

import { useMemo, useState } from "react";
import { RISK_COLORS } from "../../data/mockRiskData";
import "./Alerts.css";

const SEVERITY_ORDER = { high: 3, moderate: 2, low: 1 };

export default function AlertBanner({ alerts = [] }) {
  const [dismissedIds, setDismissedIds] = useState([]);

  const topAlert = useMemo(() => {
    const active = alerts.filter((a) => !dismissedIds.includes(a.id));
    if (active.length === 0) return null;

    return [...active].sort(
      (a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
    )[0];
  }, [alerts, dismissedIds]);

  if (!topAlert) return null;

  const color = RISK_COLORS[topAlert.severity] || RISK_COLORS.moderate;

  return (
    <div className="alert-banner" style={{ backgroundColor: color }}>
      <span className="alert-banner-icon" aria-hidden="true">
        ⚠
      </span>
      <div className="alert-banner-text">
        <strong>{topAlert.title}</strong> — {topAlert.region}
      </div>
      <button
        className="alert-banner-close"
        onClick={() => setDismissedIds((prev) => [...prev, topAlert.id])}
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
}