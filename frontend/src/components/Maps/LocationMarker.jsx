// // LocationMarker.jsx
// // Displays the user's current (or selected) location as a marker with an
// // accuracy circle, plus a popup with the place name.

// import { Marker, Popup, Circle } from "react-leaflet";
// import L from "leaflet";

// // Default Leaflet marker icons don't load correctly with bundlers unless
// // configured — this fixes the missing icon issue.
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// export default function LocationMarker({ location }) {
//   if (!location) return null;

//   const { latitude, longitude, name, accuracy } = location;
//   const position = [latitude, longitude];

//   return (
//     <>
//       <Marker position={position}>
//         <Popup>
//           <strong>{name || "Your location"}</strong>
//           <br />
//           {latitude.toFixed(4)}, {longitude.toFixed(4)}
//         </Popup>
//       </Marker>

//       {typeof accuracy === "number" && (
//         <Circle
//           center={position}
//           radius={accuracy}
//           pathOptions={{
//             color: "#3388ff",
//             fillColor: "#3388ff",
//             fillOpacity: 0.1,
//             weight: 1,
//           }}
//         />
//       )}
//     </>
//   );
// }
import React from 'react';
// LocationMarker.jsx
// Displays the user's current (or selected) location as a marker with an
// accuracy circle, plus a popup with the place name.

import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Default Leaflet marker icons don't load correctly with bundlers unless
// configured — this fixes the missing icon issue.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LocationMarker({ location }) {
  if (!location) return null;

  const { latitude, longitude, name, accuracy } = location;
  const position = [latitude, longitude];

  return (
    <>
      <Marker position={position}>
        <Popup>
          <strong>{name || "Your location"}</strong>
          <br />
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Popup>
      </Marker>

      {typeof accuracy === "number" && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#3388ff",
            fillColor: "#3388ff",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
    </>
  );
}