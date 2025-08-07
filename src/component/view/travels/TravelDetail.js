import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Stack,
  Paper,
  Avatar,
  Alert,
  Snackbar,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ImageSlider from "../routes/ImageSlider";

function TravelDetail() {
  // http://localhost:8080/get_places_tourist_attraction_details
  const navigate = useNavigate();
  const [placesDataDetail, setPlacesDataDetail] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });
  const location = useLocation();
  const stateDetail = location.state;

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const cachedData = sessionStorage.getItem("placesDataDetail");
    if (cachedData) {
      setPlacesDataDetail(JSON.parse(cachedData));
      console.log("ใช้ข้อมูลจาก sessionStorage");
    } else {
      LoadDataPlaceDetail(); // ถ้าไม่มี cache ค่อยโหลดจาก API
    }
  }, []);

  const LoadDataPlaceDetail = async () => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/get_places_tourist_attraction_details", stateDetail, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res.data", res.data);

      setPlacesDataDetail(res.data);
      localStorage.setItem("placesDataDetail", JSON.stringify(res.data)); // เซฟไว้ใช้ครั้งหน้า
    } catch (err) {
      console.error("Fetch failed:", err);
      setErrorSnackbar({
        open: true,
        message: "โหลดข้อมูลล้มเหลว",
      });
    } finally {
      setLoading(false);
    }
  };

  const EnergyItem = ({ icon, label, value, unit, color }) => (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        minWidth: 200,
        flex: 1,
        bgcolor: "#fffdf8",
      }}
      elevation={2}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value} <Typography variant="caption">{unit}</Typography>
          </Typography>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* ภาพและแผนที่ */}
        <ImageSlider images={placesDataDetail.images} BASE_URL={BASE_URL} />


        {/* ข้อมูลรายละเอียด */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ผาชมตะวัน
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            ประวัติความเป็นมา
          </Typography>

          {/* ย่อหน้า 1 */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {placesDataDetail?.historyDescription}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            กิจกรรม
          </Typography>
          <Typography> {placesDataDetail?.activities}</Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            ค่าธรรมเนียม
          </Typography>
          <Typography>{placesDataDetail?.cost}</Typography>

          <Divider sx={{ my: 3 }} />
          {/* ข้อมูลการใช้งาน */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              รายละเอียดสถานที่
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="h4" color="primary">
                    {placesDataDetail?.touristCapacity}
                  </Typography>
                  <Typography variant="body2">การตรวจวัดนักท่องเที่ยว</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography > {placesDataDetail?.openingHours}</Typography>
                  <Typography variant="body2">เวลาทำการ</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="body1">{placesDataDetail?.openingHours}</Typography>
                  <Typography variant="body2">ฤดูการท่องเที่ยว</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="body1">{placesDataDetail?.carFootprintPerDay}</Typography>
                  <Typography variant="body2">คาร์ฟุตพริ้นท์/วัน</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* ข้อมูลสิ่งแวดล้อม */}
          <Divider sx={{ my: 3 }} />
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" gutterBottom>
                การใช้พลังงาน
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 3 }}
              >
                <EnergyItem
                  icon={<FlashOnIcon />}
                  label="การใช้ไฟฟ้า"
                  value={placesDataDetail?.electricityUsage}
                  unit="หน่วย ⚡"
                  color="orange"
                />
                <EnergyItem
                  icon={<OpacityIcon />}
                  label="การใช้น้ำ"
                  value={placesDataDetail?.waterUsage}
                  unit="ลิตร 💧"
                  color="skyblue"
                />
                <EnergyItem
                  icon={<LocalGasStationIcon />}
                  label="การใช้น้ำมัน"
                  value={placesDataDetail?.fuelUsage}
                  unit="ลิตร/วัน ⛽"
                  color="gray"
                />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                การจัดการน้ำและการปล่อยน้ำเสีย
              </Typography>
              <Typography>{placesDataDetail?.wastewaterManagement}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                การจัดการขยะ
              </Typography>
              <Typography>{placesDataDetail?.wasteManagement}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                การปล่อยคาร์บอนของสถานที่ท่องเที่ยว
              </Typography>
              <Typography>
                {placesDataDetail?.ecoSystemChange}
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mt: 4 }}>
                ติดต่อสอบถาม
              </Typography>
              <Typography>{placesDataDetail?.contactInfo}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                ที่ตั้ง
              </Typography>
              <Typography>
                {placesDataDetail?.locationDescription}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                หมายเหตุ
              </Typography>
              <Typography>{placesDataDetail?.notes}</Typography>
            </Box>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" />
                <Typography variant="body2">Admin</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2">7 เดือนที่แล้ว</Typography>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {/* // JSX ส่วนแสดง error Snackbar */}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ fontWeight: "bold" }}
        >
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TravelDetail;
