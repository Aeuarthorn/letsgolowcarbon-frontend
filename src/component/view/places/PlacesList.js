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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { get_places_tourist_attraction_guest, get_show_image } from "../../api/API";

function PlacesList() {
    const { type, placeType } = useParams();  // ดึง type และ placeType จาก URL
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
    // console.log("stateList Places", stateList);
    // console.log("placesData", placesData);

    // กำหนดชื่อหัวข้อจาก placeType หรือ fallback เป็น สถานที่ท่องเที่ยว
    const headingLabelMap = {
        travels: "สถานที่ท่องเที่ยว",
        "home-stay": "ที่พัก",
        food: "ร้านอาหาร",
        gift: "ร้านของที่ระลึก",
        market: "ผลิตภัณฑ์ชุมชน",
    };
    const headingLabel = headingLabelMap[placeType] || "สถานที่";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    get_places_tourist_attraction_guest,
                    stateList, // ใส่ body ตามที่ API ต้องการ (ถ้ามี)
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("res", res.data);
                if (Array.isArray(res.data)) {
                    setPlacesData(res.data);
                    sessionStorage.setItem("placesData", JSON.stringify(res.data));
                } else {
                    setPlacesData([]);
                }
            } catch (err) {
                setErrorSnackbar({
                    open: true,
                    message: "โหลดข้อมูลล้มเหลว",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, placeType, token]);
   
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
                {headingLabel}
            </Typography>

            {placesData?.map((districtData) => {
                // console.log("districtData", districtData);

                return (
                    <Box key={districtData?.slug} sx={{ mb: 6 }}>
                        <Typography variant="h5" fontWeight="bold" mb={3}>
                            {headingLabel}ใน {districtData?.district}
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
                            {districtData?.places?.map((place) => {
                                // console.log("place++++++++", place);
                                return (
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
                                                image={`${get_show_image}/${place?.image}`}
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
                                )
                            })}
                        </Grid>
                    </Box>
                )
            })}

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

export default PlacesList