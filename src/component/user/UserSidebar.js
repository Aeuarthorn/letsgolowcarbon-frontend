import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Toolbar,
} from "@mui/material";
import {
    Place,
    Hotel,
    Restaurant,
    ShoppingBag,
    LocalOffer,
} from "@mui/icons-material";

const menuItems = [
    { key: "tourist", label: "เพิ่มสถานที่ท่องเที่ยว", icon: <Place /> },
    { key: "homestay", label: "เพิ่มที่พัก", icon: <Hotel /> },
    { key: "food", label: "เพิ่มร้านอาหาร", icon: <Restaurant /> },
    { key: "souvenir", label: "เพิ่มร้านของที่ระลึก", icon: <ShoppingBag /> },
    { key: "community", label: "เพิ่มผลิตภัณฑ์ชุมชน", icon: <LocalOffer /> },
];

const drawerWidth = 240;
function UserSidebar({ onSelect }) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    bgcolor: "#e8f5e9",
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {menuItems.map(({ key, label, icon }) => (
                        <ListItem button key={key} onClick={() => onSelect(key)}>
                            <ListItemIcon sx={{ color: "green" }}>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default UserSidebar