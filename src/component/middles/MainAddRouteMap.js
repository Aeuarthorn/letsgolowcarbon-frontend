import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Box, Button, Typography, Paper, List, ListItem, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
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

// Component เล็ก ๆ สำหรับให้ map ทำการย้ายตำแหน่ง (flyTo)
function FlyToLocation({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 2 });
    }
  }, [position, map]);

  return null;
}


const routeOptions = [
  { id: 'route1', label: 'เส้นทาง 1' },
  { id: 'route2', label: 'เส้นทาง 2' },
  { id: 'route3', label: 'เส้นทาง 3' },
];



// ====== Main Component ======
export default function MainAddRouteMap() {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(routeOptions[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null); // [lat, lng]

  // เพิ่มพิกัดใหม่ใน points
  const addPoint = (position, name = "") => {
    setPoints((prev) => [...prev, { position, name }]);
    setRoutePolyline([]);
    setLoading(false)
  };
  // ฟังก์ชันค้นหาโดยใช้ Nominatim API
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const position = [parseFloat(lat), parseFloat(lon)];
        addPoint(position, display_name);
      } else {
        alert("ไม่พบสถานที่ที่ค้นหา");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการค้นหา:", error);
      alert("เกิดข้อผิดพลาดในการค้นหา");
      setLoading(false)
    }
  };

  const handleAddPoint = (point) => {
    setPoints((prev) => [...prev, point]);
    setRoutePolyline([]); // ล้างเส้นทางเมื่อมีการเพิ่มจุดใหม่
  };

  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
    console.log('เลือกเส้นทาง:', event.target.value);
    // ถ้าต้องโหลดข้อมูลเส้นทางตามที่เลือก ก็ทำที่นี่
  };

  const handleReset = () => {
    setPoints([]);
    setRoutePolyline([]);
  };

  const handleRemovePoint = (index) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
    setRoutePolyline([]);
  };

  const handleSubmit = async () => {
    if (points.length < 2) {
      alert("ต้องมีอย่างน้อย 2 จุดเพื่อคำนวณเส้นทาง");
      return;
    }
    let totalDistance = 0;
    const fullPath = [];
    setLoading(true)
    try {
      for (let i = 0; i < points.length - 1; i++) {
        const from = {
          lat: points[i].position[0],
          lng: points[i].position[1],
        };
        const to = {
          lat: points[i + 1].position[0],
          lng: points[i + 1].position[1],
        };
        const segment = await fetchRouteBetweenPoints(from, to);
        fullPath.push(...segment);
      }

      for (let i = 0; i < fullPath.length - 1; i++) {
        totalDistance += getDistance(fullPath[i], fullPath[i + 1]);
      }

      setRoutePolyline(fullPath);
      // alert(`รวมทั้งหมด: ${(totalDistance / 1000).toFixed(2)} km`);
      console.log(`รวมทั้งหมด: ${(totalDistance / 1000).toFixed(2)} km`);
      // เก็บสถานที่ท่องเที่ยว แตต่ละจุด Marker จะมีชื่อและพิกัด เข้าฐานข้อมูลในตาราง travelroute
      // 
      setLoading(false)
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการโหลดเส้นทาง", err);
      alert("เกิดข้อผิดพลาดในการดึงเส้นทาง กรุณาลองใหม่");
      setLoading(false)
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        เพิ่มจุดเส้นทางบนแผนที่
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 300, flexShrink: 0 }}>
          <InputLabel id="select-route-label">เลือกเส้นทาง</InputLabel>
          <Select
            labelId="select-route-label"
            value={selectedRoute}
            label="เลือกเส้นทาง"
            onChange={handleRouteChange}
          >
            {routeOptions.map((route) => (
              <MenuItem key={route.id} value={route.id}>
                {route.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={1} flexGrow={1}>
          <TextField
            fullWidth
            label="พิกัดตำแหน่ง (Lat, Lng)"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            เพิ่ม
          </Button>
        </Box>
      </Box>
      {/* MAP */}
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

        {points?.map((p, idx) => {
          const isMiddlePoint = idx > 0 && idx < points.length - 1;
          const numberedIcon = createNumberedIcon(idx + 1, isMiddlePoint);

          return (
            <Marker key={idx} position={p.position} icon={numberedIcon}>
              <Popup>
                จุดที่ {idx + 1}
                <br />
                {p.name && <><b>{p.name}</b><br /></>}
                <br />
                Lat: {p.position[0].toFixed(6)}<br />
                Lng: {p.position[1].toFixed(6)}<br />
                <br />
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
            positions={routePolyline.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "blue", weight: 4 }}
          />
        )}
      </MapContainer>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="body1" mb={1}>
          รายการพิกัด:
        </Typography>
        {points.length > 0 ? (
          <List dense>
            {points.map((p, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleRemovePoint(i)}
                  >
                    ลบ
                  </Button>
                }
              >
                จุดที่ {i + 1} — {p.name ? `${p.name} — ` : ""}
                Lat: {p.position[0].toFixed(6)}, Lng: {p.position[1].toFixed(6)}
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