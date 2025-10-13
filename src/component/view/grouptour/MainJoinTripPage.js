import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Link, Switch, Stack, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { close_trip_group, get_trip_group_all } from "../../api/API";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 46,
    height: 26,
    padding: 0,
    display: "flex",
    "& .MuiSwitch-switchBase": {
        padding: 1.2,
        "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: "#2d6a4f",
                opacity: 1,
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 0 0 / 20%)",
        width: 22,
        height: 22,
        borderRadius: 11,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#cfd8dc",
    },
}));

function MainJoinTripPage() {
    const navigate = useNavigate();
    console.log("MainJoinTripPage");
    const token = localStorage.getItem("token");
    const [dataTripGroup, setDataTripGroup] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"
    const decoded = jwtDecode(token);
    const currentUID = decoded?.uid || decoded?.user_id || null; // ขึ้นอยู่กับชื่อ field ที่ backend ใช้
    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });
    console.log("currentUID", currentUID);

    // get_trip_group_all
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setInitialLoading(true);
            try {
                const response = await axios.get(get_trip_group_all, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ set state หลังดึงข้อมูล
                setDataTripGroup(response.data);
            } catch (err) {
                setErrorSnackbar({
                    open: true,
                    message: "โหลดข้อมูลล้มเหลว",
                });
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [token]); // ⚡ เพิ่ม token เป็น dependency

    console.log("dataTripGroup", dataTripGroup);
    const handleToggleStatus = async (tripId) => {
        console.log("tripId", tripId);

        try {
            const response = await axios.post(
                close_trip_group,
                { id: tripId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("response", response);

            // ✅ อัปเดตข้อมูลใน state
            setDataTripGroup((prev) =>
                prev.map((trip) =>
                    trip.id === tripId ? { ...trip, ...response.data.data } : trip
                )
            );
        } catch (error) {
            console.error("Toggle failed:", error);
            setSnackbarMessage("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    // map API data ให้ตรงกับ component
    const trips = dataTripGroup?.map((trip) => ({
        id: trip?.id,
        uid: trip?.uid, // ✅ เพิ่มตรงนี้
        title: `${trip?.district?.name} (${trip?.travel_type?.name})`,
        detail: trip?.descriptions,
        num_people: trip?.num_people,
        flag_active: trip?.flag_active,
        status: trip?.status,
        travel_type: trip?.travel_type?.name,
        path: trip?.path, // เก็บ path ไว้ใช้งานต่อได้
    }));

    const handleJoinTrip = (id, index, tripData) => {
        // console.log("Trip ID:", id);
        // console.log("Trip Index:", index);
        // console.log("Trip Object:", tripData);

        // ตัวอย่าง: ส่งไป route ใหม่
        navigate("/tour/join-trip/detail", { state: { trip: tripData } });

        // หรือถ้าส่งแค่ id ไป backend
        // axios.post("/api/join-trip", { trip_id: id });
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6,
            }}
        >
            <Typography variant="h4" fontWeight="bold" color="green" sx={{ mb: 4 }}>
                🌿 เข้าร่วมทริป
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "90%", maxWidth: 900 }}>
                {trips.map((trip, index) => {
                    console.log("trip", trip);

                    return (
                        <Paper
                            key={trip.id}
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="green">
                                    {trip.title}
                                </Typography>
                                <Link
                                    // href="#"
                                    underline="hover"
                                    sx={{ fontSize: "0.9rem", color: "green", display: "block", mt: 0.5 }}
                                >
                                    รายละเอียดทริป
                                </Link>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                {/* กล่องสถานะ + สวิตช์ */}
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
                                    <Chip
                                        label={trip.flag_active === true ? "กำลังทำงาน" : "ปิดใช้งาน"}
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "0.85rem",
                                            backgroundColor: trip.flag_active === true ? "#2d6a4f" : "#adb5bd",
                                            color: "#fff",
                                        }}
                                    />
                                    <IOSSwitch
                                        checked={trip.flag_active}
                                        onChange={() => handleToggleStatus(trip.id)}
                                        disabled={trip.uid !== Number(currentUID)}
                                        sx={{
                                            opacity: trip.uid !== Number(currentUID) ? 0.4 : 1,
                                            pointerEvents: trip.uid !== Number(currentUID) ? "none" : "auto",
                                        }}
                                    />

                                </Stack>

                                {/* กล่องรายละเอียด */}
                                <Box
                                    sx={{
                                        backgroundColor: "green",
                                        color: "white",
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 1,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        flex: 1,
                                    }}
                                >
                                    {trip.detail}
                                </Box>

                                {/* ปุ่มเข้าร่วมทริป */}
                                <Button
                                    variant="contained"
                                    disabled={!trip.flag_active} // ❌ ปิดใช้งานถ้าทริปไม่เปิดอยู่
                                    onClick={() => handleJoinTrip(trip.id, index, trip)}
                                    sx={{
                                        backgroundColor: !trip.flag_active ? "#ccc" : "#f5f5f5",
                                        color: !trip.flag_active ? "#666" : "black",
                                        borderRadius: 3,
                                        border: "1px solid #2d6a4f",
                                        px: 3,
                                        py: 1,
                                        "&:hover": {
                                            backgroundColor: trip.flag_active ? "#d8f3dc" : "#ccc",
                                        },
                                    }}
                                >
                                    เข้าร่วมทริป
                                </Button>
                            </Box>
                        </Paper>
                    )
                })}
            </Box>

            <Button
                variant="contained"
                onClick={() => navigate("/tour")}
                sx={{
                    mt: 5,
                    background: "linear-gradient(135deg, #07ae26ff, #52b788)",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 3,
                    px: 4,
                    py: 1.2,
                    boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #95d5b2, #74c69d)",
                        transform: "translateY(-2px)",
                        boxShadow: "6px 6px 14px rgba(0,0,0,0.25)",
                    },
                    transition: "all 0.2s ease-in-out",
                }}
            >
                ⬅️ กลับหน้าหลัก
            </Button>
        </Box>
    );
}

export default MainJoinTripPage;
