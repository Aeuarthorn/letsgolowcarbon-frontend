import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 13.736717, lng: 100.523186 }; // กทม.

const MainAddRouteMap = () => {
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]); // เก็บเส้นทางที่ได้จาก Directions API
  const [input, setInput] = useState("");
  const mapRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // ฟังก์ชันเรียก Directions API และตั้งค่าเส้นทาง
  const fetchRoute = async (points) => {
    if (points.length < 2) {
      setRoutePath([]);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, points.length - 1).map((p) => ({
      location: { lat: p.lat, lng: p.lng },
      stopover: true,
    }));

    directionsService?.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING, // หรือ WALKING, BICYCLING ตามต้องการ
        optimizeWaypoints: true, // เพื่อให้ Google หาทางที่ใกล้ที่สุด
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const path = [];

          // ดึง path ทุกจุดจาก legs ของ route
          result.routes[0].legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              step.path.forEach((latlng) => {
                path.push({ lat: latlng.lat(), lng: latlng.lng() });
              });
            });
          });

          setRoutePath(path);
        } else {
          console.error("Directions request failed due to " + status);
          setRoutePath([]);
        }
      }
    );
  };

  const handleAddPoint = async () => {
    const parts = input.split(",");
    if (parts.length !== 2) {
      alert("กรุณากรอกพิกัดในรูปแบบ lat,lng เช่น 13.7367,100.5231");
      return;
    }
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());

    if (isNaN(lat) || isNaN(lng)) {
      alert("พิกัดไม่ถูกต้อง");
      return;
    }

    try {
      // Reverse geocoding ไม่เปลี่ยนแปลง
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const name =
        data.name || data.display_name?.split(",")[0]?.trim() || `(${lat}, ${lng})`;

      const newPoints = [...points, { lat, lng, name }];
      setPoints(newPoints);
      setInput("");

      // เรียกหาทางที่ใกล้ที่สุดทุกครั้งที่เพิ่มจุด
      fetchRoute(newPoints);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      const newPoints = [...points, { lat, lng, name: `(${lat}, ${lng})` }];
      setPoints(newPoints);
      setInput("");
      fetchRoute(newPoints);
    }
  };

  useEffect(() => {
    if (points.length && mapRef.current) {
      const last = points[points.length - 1];
      mapRef.current.panTo(last);
      mapRef.current.setZoom(14);
    }
  }, [points]);

  if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box
      sx={{
        borderRadius: 2,
        height: '100vh',
        // border: "2px solid #81c784", // สีเขียว MUI
        // backgroundColor: "#e8f5e9", // สีเขียวอ่อน
        overflow: "hidden",
        mt: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        📍 เพิ่มจุดและเส้นทางบน Google Map
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="พิกัด (lat,lng)"
          placeholder="เช่น 13.7367,100.5231"
          variant="outlined"
          size="medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            bgcolor: "white",
            borderRadius: 1,
          }}
        />
        <Button
          variant="contained"
          color="success"
          size="medium"
          onClick={handleAddPoint}
          sx={{
            px: 4,
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }}
        >
          เพิ่ม
        </Button>
      </Stack>
      <Box
        sx={{
          borderRadius: 2,
          border: "2px solid #81c784",
          backgroundColor: "#e8f5e9",
          overflow: "hidden",
          height: "500px", // ต้องกำหนดความสูงให้ map แสดงผล
        }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={points.length ? points[0] : defaultCenter}
          zoom={6}
          onLoad={(map) => (mapRef.current = map)}
        >
          {points.map((p, idx) => (
            <Marker key={idx} position={{ lat: p.lat, lng: p.lng }} label={`${idx + 1}`} title={p.name} />
          ))}

          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: "#2e7d32",
                strokeOpacity: 0.9,
                strokeWeight: 5,
              }}
            />
          )}
        </GoogleMap>
      </Box>

      {points.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            📌 รายการพิกัดที่เพิ่ม:
          </Typography>

          <Stack spacing={1}>
            {points.map((point, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "#f1f8e9",
                  border: "1px solid #c5e1a5",
                }}
              >
                <Typography>
                  <strong>{idx + 1}.</strong> {point.name} ({point.lat.toFixed(6)}, {point.lng.toFixed(6)})
                </Typography>
              </Box>
            ))}
          </Stack>

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2, fontWeight: "bold" }}
            onClick={() => {
              // ตัวอย่าง: บันทึกลง console หรือเปลี่ยนเป็น POST ไป API ได้
              console.log("ข้อมูลที่เพิ่ม:", points);
              alert("ข้อมูลถูกบันทึก (ดู console.log ได้)");
            }}
          >
            💾 บันทึกข้อมูล
          </Button>
        </Box>
      )
      }


    </Box >
  );
};

export default MainAddRouteMap;
