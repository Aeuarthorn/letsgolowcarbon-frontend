import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TravelList() {
  const navigate = useNavigate();
  const [placesData, setPlacesData] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });
  const location = useLocation();
  const stateList = location.state;
  const BASE_URL = "http://localhost:8080";

  console.log("stateList", stateList);
  console.log("placesData", placesData);


  useEffect(() => {
    const cachedData = sessionStorage.getItem("placesData");

    if (cachedData) {
      console.log("11");

      setPlacesData(JSON.parse(cachedData));
      console.log("ใช้ข้อมูลจาก sessionStorage");
    } else {
      console.log("22");
      LoadDataPlace(); // ถ้าไม่มี cache ค่อยโหลดจาก API
    }
  }, []);

  const LoadDataPlace = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/get_places_tourist_attraction", stateList, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res.data", res.data);
      if (Array.isArray(res.data)) {
        setPlacesData(res.data);
        sessionStorage.setItem("placesData", JSON.stringify(res.data));
      } else {
        console.warn("API response is not an array:", res.data);
        setPlacesData([]); // fallback
      }

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




  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f0f8e0",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ textAlign: "center" }}
      >
        สถานที่ท่องเที่ยว
      </Typography>

      {placesData?.map((districtData) => (
        <Box key={districtData?.slug} sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            สถานที่ท่องเที่ยวใน {districtData?.district}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: {
                xs: "center", // มือถือ: ตรงกลาง
                sm: "flex-start", // จอใหญ่ขึ้น: ชิดซ้าย
              },
            }}
          >
            {districtData?.places?.map((place) => (
              <Grid
                item
                key={place.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    // image={place.image}
                    image={`${BASE_URL}/${place.image}`}
                    alt={place.name}
                    sx={{
                      height: { xs: 180, sm: 200, md: 220 },
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {place.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {place.description.length > 100
                        ? place.description.slice(0, 100) + "..."
                        : place.description}
                    </Typography>
                    <Box
                      sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
                    >
                      <Chip
                        label="สถานที่ท่องเที่ยว"
                        size="small"
                        color="secondary"
                      />
                      <Chip
                        label={districtData.district}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        backgroundColor: "#66bb6a",
                        ":hover": { backgroundColor: "#4caf50" },
                      }}
                      // onClick={() => // แบบเดิม
                      //   navigate(`${districtData.slug}/${place.id}`)
                      // }
                      onClick={() =>
                        navigate(`${districtData.slug}/${place.id}`, {
                          state: {
                            pid: place.id,
                            type: "img_detail_place",
                            placeType: "tourist_attraction",
                            refName: "place",
                          },
                        })
                      }
                    >
                      อ่านเพิ่มเติม
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

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

export default TravelList;
