import React from "react";
import { Box, Toolbar } from "@mui/material";
import { useNavigate, Routes, Route } from "react-router-dom";
import UserSideBar from "./UserSidebar"; // Sidebar แยก
import MainAddPlaces from "../middles/MainAddPlaces";


const drawerWidth = 240;

function MainUser() {
  const navigate = useNavigate();

  const handleSelect = (key) => {
    navigate(`/user/place/${key}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <UserSideBar onSelect={handleSelect} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f1f8e9",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/place/:placeType" element={<MainAddPlaces />} />
          <Route path="*" element={<h2>กรุณาเลือกเมนูด้านซ้าย</h2>} /> 
        </Routes>
      </Box>
    </Box>
  );
}

export default MainUser;
