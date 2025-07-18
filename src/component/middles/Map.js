

import React, { useEffect, useState, useRef } from "react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    Polyline,
} from "@react-google-maps/api";

const mapContainerStyle = {
    height: "500px",
    width: "100%",
};


export const MyGoogleMap = ({ points = [], route = [] }) => {
    const mapRef = useRef(null);

    // Focus map ไปยังจุดล่าสุดเมื่อเพิ่มจุดใหม่
    useEffect(() => {
        if (points.length > 0 && mapRef.current) {
            const lastPoint = points[points.length - 1];
            mapRef.current.panTo({ lat: lastPoint.lat, lng: lastPoint.lng });
            mapRef.current.setZoom(14);
        }
    }, [points]);

    return (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={points.length ? points[0] : { lat: 13.736717, lng: 100.523186 }} //กรุงเทพ
                zoom={6}
                onLoad={(map) => (mapRef.current = map)}
            >
                {points.map((p, idx) => (
                    <Marker
                        key={idx}
                        position={{ lat: p.lat, lng: p.lng }}
                        label={`${idx + 1}`}
                    />
                ))}

                {route.length > 1 && (
                    <Polyline
                        path={route}
                        options={{
                            strokeColor: "#007bff",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );

}
// export const fetchRouteBetweenPoints = async (from, to) => {
//     const response = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
//     );
//     const data = await response.json();
//     return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
//         lat,
//         lng,
//     }));
// };

// export function createNumberedIcon(number, isMiddle = false) {
//     return L.divIcon({
//         html: `<div style="
//       background-color: ${isMiddle ? "#ffc107" : "#007bff"};
//       color: white;
//       border-radius: 50%;
//       width: 32px;
//       height: 32px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 16px;
//       border: 2px solid white;
//       box-shadow: 0 0 4px rgba(0,0,0,0.5);
//     ">${number}</div>`,
//         className: "",
//         iconSize: [32, 32],
//         iconAnchor: [16, 32],
//         popupAnchor: [0, -32],
//     });
// }
// // ====== Component สำหรับคลิกแผนที่เพื่อเพิ่มจุด ======
// export function LocationMarker({ onAddPoint }) {
//     useMapEvents({
//         click: async (e) => {
//             const { lat, lng } = e.latlng;

//             try {
//                 const res = await fetch(
//                     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//                 );
//                 const data = await res.json();
//                 // const name = data.display_name || ""; // name_full
//                 const name = data.display_name?.split(",")[0]?.trim() || "";
//                 onAddPoint({ position: [lat, lng], name });
//             } catch (err) {
//                 console.error("Reverse geocoding failed", err);
//                 onAddPoint({ position: [lat, lng], name: "" });
//             }
//         },
//     });

//     return null;
// }

// // ====== Component สำหรับคลิกแผนที่เพื่อดู ======
// export function LocationMarkerView({ onAddPoint }) {
//     // useMapEvents({
//     //     click(e) {
//     //         const { lat, lng } = e.latlng;
//     //         onAddPoint({ lat, lng });
//     //     },
//     // });
//     return null;
// }
