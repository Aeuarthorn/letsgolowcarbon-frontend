
import {
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";

export const fetchRouteBetweenPoints = async (from, to) => {
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI1OWMyZWE5OGNiMzRkNWJiOTU3YmY4NDkxMDUwN2RmIiwiaCI6Im11cm11cjY0In0="; // 🔑 ใส่ API key ที่นี่
    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const body = {
        coordinates: [
            [from.lng, from.lat],
            [to.lng, to.lat],
        ],
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("ไม่สามารถดึงเส้นทางจาก OpenRouteService ได้");
    }

    const data = await res.json();
    return data.features[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
};

export const createNumberedIcon = (number, isMiddle) =>
    L.divIcon({
        className: "custom-numbered-icon",
        html: `<div style="
      background-color: ${isMiddle ? "red" : "#1976d2"};
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    ">${number}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });


// ====== Component สำหรับคลิกแผนที่เพื่อเพิ่มจุด ======
export function LocationMarker({ onAddPoint }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onAddPoint({ lat, lng });
        },
    });
    return null;
}

// ====== Component สำหรับคลิกแผนที่เพื่อดู ======
export function LocationMarkerView({ onAddPoint }) {
    // useMapEvents({
    //     click(e) {
    //         const { lat, lng } = e.latlng;
    //         onAddPoint({ lat, lng });
    //     },
    // });
    return null;
}
