import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PlaceIcon from "@mui/icons-material/Place";
import HotelIcon from "@mui/icons-material/Hotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";


const summaryItems = [
    { label: "ผู้ใช้งานทั้งหมด", count: 128, icon: <GroupIcon />, color: "#81c784" },
    { label: "สถานที่ท่องเที่ยว", count: 45, icon: <PlaceIcon />, color: "#66bb6a" },
    { label: "ที่พัก/โฮมสเตย์", count: 20, icon: <HotelIcon />, color: "#4caf50" },
    { label: "ร้านอาหาร", count: 36, icon: <RestaurantIcon />, color: "#388e3c" },
];


function AdminDashboard() {
    const [loading, setLoading] = useState(false)

    const LoadData = async () => {

    }

    useEffect(() => {

    }, [])



    return (
        <Box sx={{ p: 4,  minHeight: '100vh' }}>
            <Typography variant="h4" color="green" gutterBottom>
                แดชบอร์ดผู้ดูแลระบบ
            </Typography>
            <Grid container spacing={3}>
                {summaryItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                bgcolor: item.color,
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: 150,
                                justifyContent: "center",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                                },
                            }}
                        >
                            {item.icon}
                            <Typography variant="h6">{item.label}</Typography>
                            <Typography variant="h5" fontWeight="bold">
                                {item.count}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default AdminDashboard