import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { get_show_image } from "../../api/API";

function MainJoinTripPageDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state?.trip; // รับ object trip ที่ส่งมาจาก navigate
    // ตัวอย่างข้อมูลทริป
    console.log("trip", trip);


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6,
                gap: 4,
            }}
        >
            {/* ชื่อทริป */}
            <Typography variant="h4" fontWeight="bold" color="green" sx={{ mb: 2 }}>
                {trip.title}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    width: "90%",
                    maxWidth: 900,
                }}
            >
                {/* QR Code */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        minHeight: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 3,
                        backgroundColor: "#b7e4c7",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "green",
                    }}
                >
                    {trip.path ? (
                        <img
                            src={`${get_show_image}/${trip.path}`}
                            alt="QR Code"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                borderRadius: 8,
                            }}
                        />
                    ) : (
                        "No QR Code"
                    )}
                </Paper>

                {/* รายละเอียดทริป */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 2,
                        minHeight: 200,
                        borderRadius: 3,
                        backgroundColor: "green",
                        color: "white",
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {trip.detail}
                </Paper>
            </Box>

            {/* จำนวนวันและคน */}
            <Paper
                elevation={3}
                sx={{
                    width: "90%",
                    maxWidth: 900,
                    borderRadius: 3,
                    backgroundColor: "green",
                    color: "white",
                    p: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                {`${trip.travel_type} (จำนวนสมาชิก ${trip.num_people} คน) `}
            </Paper>
            <Button
                variant="contained"
                onClick={() => navigate("/tour/join-trip")}
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

export default MainJoinTripPageDetail