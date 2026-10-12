// // RiskLayer.jsx
// // Renders risk zones (from Person 3's risk model, via mapService) as
// // color-coded circles: green = low, yellow = moderate, red = high.

// import { Circle, Popup } from "react-leaflet";
// import { RISK_COLORS, RISK_LABELS } from "../../data/mockRiskData";

// export default function RiskLayer({ zones = [] }) {
//   return (
//     <>
//       {zones.map((zone) => {
//         const color = RISK_COLORS[zone.riskLevel] || RISK_COLORS.low;

//         return (
//           <Circle
//             key={zone.id}
//             center={[zone.latitude, zone.longitude]}
//             radius={zone.radiusMeters}
//             pathOptions={{
//               color,
//               fillColor: color,
//               fillOpacity: 0.25,
//               weight: 2,
//             }}
//           >
//             <Popup>
//               <strong>{zone.name}</strong>
//               <br />
//               Risk: <span style={{ color }}>{RISK_LABELS[zone.riskLevel]}</span>
//               <br />
//               {zone.hazard && <>Hazard: {zone.hazard}</>}
//             </Popup>
//           </Circle>
//         );
//       })}
//     </>
//   );
// }
import React from 'react';
// RiskLayer.jsx
// Renders risk zones (from Person 3's risk model, via mapService) as
// color-coded circles: green = low, yellow = moderate, red = high.

import { Circle, Popup } from "react-leaflet";
import { RISK_COLORS, RISK_LABELS } from "../../data/mockRiskData";

export default function RiskLayer({ zones = [] }) {
  return (
    <>
      {zones.map((zone) => {
        const color = RISK_COLORS[zone.riskLevel] || RISK_COLORS.low;

        return (
          <Circle
            key={zone.id}
            center={[zone.latitude, zone.longitude]}
            radius={zone.radiusMeters}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              Risk: <span style={{ color }}>{RISK_LABELS[zone.riskLevel]}</span>
              <br />
              {zone.hazard && <>Hazard: {zone.hazard}</>}
            </Popup>
          </Circle>
        );
      })}
    </>
  );
}