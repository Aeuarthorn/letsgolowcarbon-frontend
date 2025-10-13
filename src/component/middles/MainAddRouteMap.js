import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { create_travel_route, map_search, travel_admin } from "../api/API";

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 13.736717, lng: 100.523186 }; // กทม.

const MainAddRouteMap = () => {
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]); // เก็บเส้นทางที่ได้จาก Directions API
  const [input, setInput] = useState("");
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [travelses, setTravelses] = useState([]); // 👉 ลิสต์ข้อมูลจาก API
  const [selectedTravelses, setSelectedTravelses] = useState(""); // 👉 tid ที่ถูกเลือก
  const token = localStorage.getItem("token");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOpentravel, setAlertOpentravel] = useState(false);
  const [alertMessagetravel, setAlertMessagetravel] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

  const [placeOptions, setPlaceOptions] = useState([]);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null); // ข้อมูลเต็มของสถานที่ที่เลือก
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const loadTravelses = async () => {
    try {
      const response = await axios.get(travel_admin, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTravelses(response.data || []); // ตรวจสอบรูปแบบ data ด้วย (array?)
      console.log("✅ ดึงข้อมูลอำเภอสำเร็จ:", response.data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
    }
  };
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
    console.log("lat", lat);
    console.log("lng", lng);

    try {
      const res = await fetch(
        `${map_search}?lat=${lat}&lng=${lng}`,
        {
          method: "GET", // กรณีนี้ใช้ GET
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("📍 ข้อมูลจาก API หลังบ้าน:", data);

      if (data.results?.length > 0) {
        setPlaceOptions(data.results);
        // setSelectedPlaceName(data.results[0].name);
      } else {
        setPlaceOptions([]);
        setSelectedPlaceName(`(${lat.toFixed(6)}, ${lng.toFixed(6)})`);
      }
    } catch (error) {
      console.error("❗ Error fetching place info:", error);
      setPlaceOptions([]);
      setSelectedPlaceName(`(${lat}, ${lng})`);
    }
  };

  const handleConfirmAdd = () => {
    if (!selectedPlace) return;

    const newPoint = {
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
      name: selectedPlace.name,
    };

    const newPoints = [...points, newPoint];
    setPoints(newPoints);
    setInput("");
    setPlaceOptions([]);
    setSelectedPlaceName("");
    // setSelectedPlace(null);
    fetchRoute(newPoints); // ค่อยเรียกหาเส้นทาง
  };

  const handletravelsesChange = (event) => {
    const tid = event.target.value;
    setSelectedTravelses(tid); // ✅ เก็บค่า tid ที่เลือก
    console.log("🆔 tid ที่เลือก:", tid);
  };

  useEffect(() => {
    // 1. โหลด Districts ครั้งเดียวเมื่อ map พร้อม
    if (isLoaded && token && travelses.length === 0) {
      loadTravelses();
    }

    // 2. Pan ไปยังจุดล่าสุดเมื่อเพิ่มจุด
    if (points.length && mapRef.current) {
      const last = points[points.length - 1];
      mapRef.current.panTo(last);
      if (points.length === 1) {
        mapRef.current.setZoom(14);
      }
    }
  }, [points, isLoaded, token]);

  const handleSaveData = async () => {
    if (!selectedTravelses || selectedTravelses.length === 0) {
      setAlertMessagetravel("โปรดเลือกอำเภอ");
      setAlertOpentravel(true);
      return;
    }

    if (points.length < 2) {
      setAlertMessage("ต้องเพิ่มจุดอย่างน้อย 2 จุดก่อนบันทึกข้อมูล");
      setAlertOpen(true);
      return;
    }

    setLoading(true); // 🔄 เริ่มโหลด

    try {
      const enrichedPoints = points.map((point) => ({
        ...point,
        tid: selectedTravelses,
      }));

      const response = await axios.post(
        create_travel_route,
        enrichedPoints,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
        setSnackbarSeverity("success");

        // 🧹 เคลียร์ค่าหลังบันทึก
        setPoints([]);
        setSelectedTravelses(null); // หรือ [] ขึ้นอยู่กับรูปแบบ
      } else {
        setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("❗ Error ส่งข้อมูล:", error);
      setSnackbarMessage("⚠️ เกิดข้อผิดพลาดขณะส่งข้อมูล");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setLoading(false); // 🔚 หยุดโหลด
    }
  };

  if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box
      sx={{
        borderRadius: 2,
        // height: '100vh',
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
        <FormControl sx={{ minWidth: 250 }} size="medium">
          <InputLabel id="travelses-select-label">เส้นทาง</InputLabel>
          <Select
            name="travelses-select"
            labelId="travelses-select-label"
            id="travelses-select"
            value={selectedTravelses} // ✅ ใช้ค่าที่เลือก
            label="อำเภอ"
            onChange={handletravelsesChange}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
            }}
          >
            <MenuItem value="">
              <em>-- เลือกอำเภอ --</em>
            </MenuItem>
            {travelses?.map((d) => (
              <MenuItem key={d.tid} value={d.tid}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            width: "200px",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }}
        >
          ค้นหาสถานที่
        </Button>
      </Stack>
      {/* {placeOptions.length > 0 && ( */}
      <Box mt={2} mb={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <FormControl fullWidth sx={{ flex: 3 }}>
            <InputLabel id="place-select-label">เลือกสถานที่</InputLabel>
            <Select
              sx={{
                bgcolor: "white",
                borderRadius: 1,
              }}
              labelId="place-select-label"
              value={selectedPlaceName}
              label="เลือกสถานที่"
              onChange={(e) => {
                const name = e.target.value;
                setSelectedPlaceName(name);
                const matched = placeOptions.find((p) => p.name === name);
                if (matched) {
                  setSelectedPlace(matched);
                  // 👇 คุณสามารถเรียกแสดง marker preview ที่นี่
                }
              }}
            >
              {placeOptions.map((place, index) => (
                <MenuItem key={index} value={place.name}>
                  {place.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            disabled={selectedPlaceName === ""}
            sx={{
              height: "56px",
              flex: 1,
              color: "white",
              bgcolor: "#2045e6ff",
              "&:hover": {
                bgcolor: "#1b5e20",
              },
            }}
            onClick={handleConfirmAdd}
          >
            เพิ่มพิกัด
          </Button>
        </Stack>
      </Box>
      {/* )} */}
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
            <Marker
              key={idx}
              position={{ lat: p.lat, lng: p.lng }}
              label={`${idx + 1}`}
              title={p.name}
            />
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
      <Box
        sx={{
          mt: 3,
          borderRadius: 2,
          border: "2px solid #81c784",
          backgroundColor: "#e8f5e9",
          overflow: "hidden",
          // height: "300px", // ต้องกำหนดความสูงให้ map แสดงผล
        }}
      >
        <Typography variant="h6" sx={{ m: 2 }}>
          📌 <u>รายการพิกัดที่เพิ่ม</u>
        </Typography>

        {points.length > 0 && (
          <>
            <Stack spacing={1} sx={{ m: 2 }}>
              {points.map((point, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "#f1f8e9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #c5e1a5",
                  }}
                >
                  <Typography>
                    <strong>{`พิกัดที่ : ${idx + 1}`}.</strong> {point.name} (
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)})
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => {
                      const updatedPoints = points.filter((_, i) => i !== idx);
                      setPoints(updatedPoints);
                      fetchRoute(updatedPoints); // อัปเดตเส้นทาง
                    }}
                  >
                    ลบ
                  </Button>
                </Box>
              ))}
            </Stack>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2, fontWeight: "bold" }}
                onClick={handleSaveData}
                disabled={loading}
              >
                {loading ? "⏳ กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* 🔄 Backdrop ขณะโหลด */}
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="warning"
          sx={{
            width: "100%",
            backgroundColor: "#d32f2f", // แดงเข้ม (error main)
            color: "#fff", // ตัวอักษรขาว
            "& .MuiAlert-icon": {
              color: "#fff", // ไอคอนขาวด้วย
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={alertOpentravel}
        autoHideDuration={3000}
        onClose={() => setAlertOpentravel(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpentravel(false)}
          severity="warning"
          sx={{
            width: "100%",
            backgroundColor: "#d32f2f", // แดงเข้ม (error main)
            color: "#fff", // ตัวอักษรขาว
            "& .MuiAlert-icon": {
              color: "#fff", // ไอคอนขาวด้วย
            },
          }}
        >
          {alertMessagetravel}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainAddRouteMap;
