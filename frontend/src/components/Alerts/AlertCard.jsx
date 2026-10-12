
// import React from 'react';
// // AlertCard.jsx
// // Displays a single official weather alert/warning.

// import { RISK_COLORS, RISK_LABELS } from "../../data/mockRiskData";
// import "./Alerts.css";

// function formatDate(iso) {
//   try {
//     return new Date(iso).toLocaleString(undefined, {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return iso;
//   }
// }

// export default function AlertCard({ alert, onSelect }) {
//   const color = RISK_COLORS[alert.severity] || RISK_COLORS.low;

//   return (
//     <div
//       className="alert-card"
//       style={{ borderLeftColor: color }}
//       onClick={() => onSelect?.(alert)}
//       role={onSelect ? "button" : undefined}
//       tabIndex={onSelect ? 0 : undefined}
//     >
//       <div className="alert-card-header">
//         <span className="alert-card-severity" style={{ backgroundColor: color }}>
//           {RISK_LABELS[alert.severity] || alert.severity}
//         </span>
//         <span className="alert-card-region">{alert.region}</span>
//       </div>

//       <h4 className="alert-card-title">{alert.title}</h4>
//       <p className="alert-card-description">{alert.description}</p>

//       <div className="alert-card-footer">
//         <span>{alert.issuedBy}</span>
//         <span>Valid until {formatDate(alert.validUntil)}</span>
//       </div>
//     </div>
//   );
// }
import React from 'react';
// AlertCard.jsx
// Displays a single official weather alert/warning.

import { RISK_COLORS, RISK_LABELS } from "../../data/mockRiskData";
import "./Alerts.css";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AlertCard({ alert, onSelect }) {
  const color = RISK_COLORS[alert.severity] || RISK_COLORS.low;

  return (
    <div
      className="alert-card"
      style={{ borderLeftColor: color }}
      onClick={() => onSelect?.(alert)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="alert-card-header">
        <span className="alert-card-severity" style={{ backgroundColor: color }}>
          {RISK_LABELS[alert.severity] || alert.severity}
        </span>
        <span className="alert-card-region">{alert.region}</span>
      </div>

      <h4 className="alert-card-title">{alert.title}</h4>
      <p className="alert-card-description">{alert.description}</p>

      <div className="alert-card-footer">
        <span>{alert.issuedBy}</span>
        <span>Valid until {formatDate(alert.validUntil)}</span>
      </div>
    </div>
  );
}