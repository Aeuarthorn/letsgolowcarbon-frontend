import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { Box, Button, Typography, Paper, List, ListItem } from "@mui/material";
import { getDistance } from "geolib";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createNumberedIcon, fetchRouteBetweenPoints, LocationMarker } from "./Map";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



// ====== Main Component ======
export default function MainAddRouteMap() {
  const [points, setPoints] = useState([]);
  const [routePolyline, setRoutePolyline] = useState([]);

  const handleAddPoint = (point) => {
    setPoints((prev) => [...prev, point]);
    setRoutePolyline([]); // ล้างเส้นทางเมื่อมีการเพิ่มจุดใหม่
  };

  const handleReset = () => {
    setPoints([]);
    setRoutePolyline([]);
  };

  const handleRemovePoint = (index) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
    setRoutePolyline([]); // reset route
  };

  const handleSubmit = async () => {
    if (points.length < 2) {
      alert("ต้องมีอย่างน้อย 2 จุดเพื่อคำนวณระยะทาง");
      return;
    }

    let totalDistance = 0;
    const fullPath = [];

    try {
      for (let i = 0; i < points.length - 1; i++) {
        const segment = await fetchRouteBetweenPoints(points[i], points[i + 1]);
        fullPath.push(...segment);
      }

      for (let i = 0; i < fullPath.length - 1; i++) {
        totalDistance += getDistance(fullPath[i], fullPath[i + 1]);
      }

      setRoutePolyline(fullPath);

      alert(
        `รวมทั้งหมด: ${(totalDistance / 1000).toFixed(2)} km`
      );
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการโหลดเส้นทาง", err);
      alert("เกิดข้อผิดพลาดในการดึงเส้นทาง กรุณาลองใหม่");
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        เพิ่มจุดเส้นทางบนแผนที่
      </Typography>

      <MapContainer
        center={[13.736717, 100.523186]}
        zoom={6}
        style={{ height: "500px", width: "100%", borderRadius: 10 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onAddPoint={handleAddPoint} />

        {points?.map((pos, idx) => {
          const isMiddlePoint = idx > 0 && idx < points.length - 1;
          const numberedIcon = createNumberedIcon(idx + 1, isMiddlePoint);

          return (
            <Marker key={idx} position={pos} icon={numberedIcon}>
              <Popup>
                จุดที่ {idx + 1}
                <br />
                Lat: {pos.lat.toFixed(6)} <br />
                Lng: {pos.lng.toFixed(6)} <br />
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleRemovePoint(idx)}
                >
                  ลบจุดนี้
                </Button>
              </Popup>
            </Marker>
          );
        })}


        {/* เส้นทางจริงตามถนน */}
        {routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: "blue", weight: 4 }}
          />
        )}
      </MapContainer>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="body1" mb={1}>
          รายการพิกัด:
        </Typography>
        {points?.length > 0 ? (
          <List dense>
            {points?.map((p, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <Button color="error" size="small" onClick={() => handleRemovePoint(i)}>
                    ลบ
                  </Button>
                }
              >
                จุดที่ {i + 1} — Lat: {p.lat.toFixed(6)}, Lng: {p.lng.toFixed(6)}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">ยังไม่มีจุดที่เลือก</Typography>
        )}

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="warning" onClick={handleReset}>
            รีเซต
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            ยืนยันการเพิ่ม
          </Button>
        </Box>
      </Paper>

    </Box>
  );
}