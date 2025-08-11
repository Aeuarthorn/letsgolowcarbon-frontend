import React, { useEffect, useState } from "react";
import {
    Box, Grid, Paper, Typography, Divider, Accordion, AccordionSummary, AccordionDetails,
    CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GroupIcon from "@mui/icons-material/Group";
import PlaceIcon from "@mui/icons-material/Place";
import HotelIcon from "@mui/icons-material/Hotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { LocalOffer, ShoppingBag } from "@mui/icons-material";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CardItem = ({ item }) => (
    <Paper
        elevation={6}
        sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: item.color,
            color: "white",
            textAlign: "center",
            transition: "all 0.3s ease",
            "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
            },
        }}
    >
        <Box mb={1}>{item.icon}</Box>
        <Typography variant="subtitle1" fontWeight={600}>
            {item.label}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
            {item.count}
        </Typography>
    </Paper>
);

function AdminDashboard() {
    const token = localStorage.getItem("token");
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8080/get_dashboard", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDashboardData(res.data);
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const generateItems = () => {
        if (!dashboardData) return [];

        return {
            systemData: [
                { label: "ผู้ใช้งานทั้งหมด", count: dashboardData.users_count, icon: <GroupIcon />, color: "#388e3c" },
                { label: "อำเภอ", count: dashboardData.district_count, icon: <LocationCityIcon />, color: "#388e3c" },
                { label: "เส้นทาง", count: dashboardData.travel_count, icon: <LocationCityIcon />, color: "#388e3c" },
            ],
            placesData: [
                { label: "สถานที่ท่องเที่ยวทั้งหมด", count: dashboardData.places_count, icon: <PlaceIcon />, color: "#388e3c" },
                { label: "สถานที่ท่องเที่ยว", count: dashboardData.tourist_attraction_count, icon: <PlaceIcon />, color: "#388e3c" },
                { label: "ที่พัก/โฮมสเตย์", count: dashboardData.hotel_count, icon: <HotelIcon />, color: "#388e3c" },
                { label: "ร้านอาหาร", count: dashboardData.restaurant_count, icon: <RestaurantIcon />, color: "#388e3c" },
                { label: "ร้านของที่ระลึก", count: dashboardData.souvenir_count, icon: <ShoppingBag />, color: "#388e3c" },
                { label: "ผลิตภัณฑ์ชุมชน", count: dashboardData.community_product_count, icon: <LocalOffer />, color: "#388e3c" },
            ],
        };
    };

    const dataGroups = generateItems();

    return (

        <Box sx={{
            p: 4,
            minHeight: "100vh",
            // backgroundColor: "#f1f8e9"
        }}>
            <Typography variant="h4" fontWeight="bold" color="green" gutterBottom>
                แดชบอร์ดผู้ดูแลระบบ
            </Typography>

            {
                loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* 🔹 ระบบ */}
                        <Accordion defaultExpanded sx={{ backgroundColor: "#21AC2A", color: 'white' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                <Typography variant="h6">ข้อมูลระบบ</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {dataGroups?.systemData?.map((item, idx) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                                            <CardItem item={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* 🔹 สถานที่ */}
                        <Accordion defaultExpanded sx={{ mt: 3, backgroundColor: "#21AC2A", color: 'white' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                <Typography variant="h6">สถานที่ท่องเที่ยวและบริการ</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {dataGroups?.placesData?.map((item, idx) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                                            <CardItem item={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </>
                )
            }
        </Box>

    );
}

export default AdminDashboard;
