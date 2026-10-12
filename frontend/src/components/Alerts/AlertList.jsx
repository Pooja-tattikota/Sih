// // import React from 'react';
// // AlertList.jsx
// // Renders a filtered, sorted list of AlertCards. Filtering by the user's
// // saved severity/hazard preferences happens via alertService upstream,
// // but this component also supports a simple in-list severity filter.

// import { useMemo, useState } from "react";
// import AlertCard from "./AlertCard";
// import "./Alerts.css";

// const SEVERITY_ORDER = { high: 3, moderate: 2, low: 1 };
// const FILTERS = ["all", "high", "moderate", "low"];

// export default function AlertList({ alerts = [], onSelectAlert }) {
//   const [filter, setFilter] = useState("all");

//   const visibleAlerts = useMemo(() => {
//     const filtered =
//       filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

//     return [...filtered].sort(
//       (a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
//     );
//   }, [alerts, filter]);

//   return (
//     <div className="alert-list">
//       <div className="alert-list-filters">
//         {FILTERS.map((f) => (
//           <button
//             key={f}
//             className={`alert-filter-btn ${filter === f ? "active" : ""}`}
//             onClick={() => setFilter(f)}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {visibleAlerts.length === 0 ? (
//         <p className="alert-list-empty">No alerts for this filter right now.</p>
//       ) : (
//         <div className="alert-list-items">
//           {visibleAlerts.map((alert) => (
//             <AlertCard key={alert.id} alert={alert} onSelect={onSelectAlert} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React from 'react';
// AlertList.jsx
// Renders a filtered, sorted list of AlertCards. Filtering by the user's
// saved severity/hazard preferences happens via alertService upstream,
// but this component also supports a simple in-list severity filter.

import { useMemo, useState } from "react";
import AlertCard from "./AlertCard";
import "./Alerts.css";

const SEVERITY_ORDER = { high: 3, moderate: 2, low: 1 };
const FILTERS = ["all", "high", "moderate", "low"];

export default function AlertList({ alerts = [], onSelectAlert }) {
  const [filter, setFilter] = useState("all");

  const visibleAlerts = useMemo(() => {
    const filtered =
      filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

    return [...filtered].sort(
      (a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
    );
  }, [alerts, filter]);

  return (
    <div className="alert-list">
      <div className="alert-list-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`alert-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {visibleAlerts.length === 0 ? (
        <p className="alert-list-empty">No alerts for this filter right now.</p>
      ) : (
        <div className="alert-list-items">
          {visibleAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onSelect={onSelectAlert} />
          ))}
        </div>
      )}
    </div>
  );
}