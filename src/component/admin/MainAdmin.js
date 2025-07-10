import React, { useState } from "react";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate, Routes, Route } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import AdminDashboard from "./AdminDashboard";
import MainAddPlaces from "../middles/MainAddPlaces";
import MainAddRoutes from "../middles/MainAddRoutes";


const drawerWidth = 260;

function MainAdmin({ screenWidth, defaultTheme }) {
  const navigate = useNavigate();

  // ฟังก์ชันเมื่อเลือกเมนูจาก sidebar
  const handleSelect = (key) => {
    switch (key) {
      case "touristPlace":
        navigate("/admin/add/place/tourist_attraction");
        break;
      case "homestay":
        navigate("/admin/add/place/hotel");
        break;
      case "restaurant":
        navigate("/admin/add/place/restaurant");
        break;
      case "souvenir":
        navigate("/admin/add/place/souvenir");
        break;
      case "communityProduct":
        navigate("/admin/add/place/community_product");
        break;
      case "addRouteName":
        navigate("/admin/add/route/route_name");
        break;
      case "addRouteMap":
        navigate("/admin/add/route/route_map");
        break;
      case "addRouteDetail":
        navigate("/admin/add/route/route_detail");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSideBar onSelect={handleSelect} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f1f8e9", }}>
        {/* <Toolbar /> */}
        <Routes>
          <Route path="/add/place/:placeType" element={<MainAddPlaces />} />
          <Route path="/add/route/:placeType" element={<MainAddRoutes />} />
          <Route path="/" element={<AdminDashboard />} /> {/* 👈 default dashboard */}
          <Route path="*" element={<h2 style={{ marginTop: 20 }}>ไม่พบหน้านี้</h2>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default MainAdmin
