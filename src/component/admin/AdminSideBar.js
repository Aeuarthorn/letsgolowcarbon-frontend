import React from "react";
import {
    Box,
    Drawer,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    AddCircle,
    Map,
    Info,
    Place,
    Hotel,
    Restaurant,
    ShoppingBag,
    LocalOffer,
    Settings,
    Image,
} from "@mui/icons-material";
import logo from "../../component/logo/icon_new.png";
import { useNavigate, Link } from "react-router-dom";
const drawerWidth = 300;

function AdminSideBar({ selected, onSelect }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ล้าง session (เช่น token หรือ cookie แล้วแต่ระบบคุณ)
        fetch("/api/logout", { method: "POST" }); // หากมี API logout
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    bgcolor: "#77B349", // เขียวเข้ม
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontWeight: 'bold',  // เพิ่มตรงนี้เพื่อให้ตัวหนา
                },
            }}
        >

            {/* โลโก้ด้านบน */}
            <Box>
                <Toolbar>
                    <Box sx={{ textAlign: "center", width: "100%" }}>
                        <Box
                            sx={{
                                display: "inline-block",
                                p: 1.5,
                                // bgcolor: "white", // พื้นหลังสีขาวตัดกับพื้นหลังเข้ม
                                borderRadius: "12px", // มุมมน
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // เงาแบบลอย
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)", // ขยายเล็กน้อยเมื่อ hover
                                },
                            }}
                        >
                            <Link to="/admin" style={{ display: "block" }}>
                                <img
                                    src={logo}
                                    alt="Low Carbon Logo"
                                    style={{
                                        width: "80%",
                                        height: "auto",
                                        display: "block",
                                        margin: "0 auto",
                                        cursor: "pointer",
                                    }}
                                />
                            </Link>
                        </Box>
                    </Box>
                </Toolbar>


                {/* เมนูหลัก */}
                <Box sx={{ overflowY: "auto", px: 1 }}>
                    {/* เพิ่มเส้นทาง */}
                    <Accordion
                        sx={{
                            bgcolor: "#21AC2A",
                            color: "white",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // เงา
                            borderRadius: 1, // มุมมนเล็กน้อย (optional)
                        }}
                        defaultExpanded
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                            <Typography>เพิ่มอำเภอ</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem button onClick={() => onSelect("addRouteDistrictName")}>
                                    <ListItemIcon><AddCircle sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มชื่ออำเภอ" />
                                </ListItem>

                            </List>
                        </AccordionDetails>
                    </Accordion>
                    {/* เพิ่มเส้นทาง */}
                    <Accordion
                        sx={{
                            bgcolor: "#21AC2A",
                            color: "white",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // เงา
                            borderRadius: 1, // มุมมนเล็กน้อย (optional)
                        }}
                        defaultExpanded
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                            <Typography>เพิ่มเส้นทาง (คำนวณ Co2e)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem button onClick={() => onSelect("addRouteName")}>
                                    <ListItemIcon><AddCircle sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มชื่อ Route" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("addRouteMap")}>
                                    <ListItemIcon><Map sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มแผนที่ Route" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("addRouteDetail")}>
                                    <ListItemIcon><Info sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มรายละเอียด Route" />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    {/* เพิ่มสถานที่ */}
                    <Accordion
                        sx={{
                            bgcolor: "#21AC2A",
                            color: "white",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // เงา
                            borderRadius: 1, // มุมมนเล็กน้อย (optional)
                        }}
                        defaultExpanded
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                            <Typography>เพิ่มสถานที่</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem button onClick={() => onSelect("touristPlace")}>
                                    <ListItemIcon><Place sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มสถานที่ท่องเที่ยว" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("homestay")}>
                                    <ListItemIcon><Hotel sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มที่พัก" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("restaurant")}>
                                    <ListItemIcon><Restaurant sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มร้านอาหาร" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("souvenir")}>
                                    <ListItemIcon><ShoppingBag sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มร้านของที่ระลึก" />
                                </ListItem>
                                <ListItem button onClick={() => onSelect("communityProduct")}>
                                    <ListItemIcon><LocalOffer sx={{ color: "#76ff03" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มผลิตภัณฑ์ชุมชน" />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    {/* ตั้งค่า */}
                    <Accordion
                        sx={{
                            bgcolor: "#21AC2A",
                            color: "white",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // เงา
                            borderRadius: 1, // มุมมนเล็กน้อย (optional)
                        }}
                        defaultExpanded
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                            <Typography>ตั้งค่าเมนู</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem button onClick={() => onSelect("addTravelType")}>
                                    <ListItemIcon><Image sx={{ color: "white" }} /></ListItemIcon>
                                    <ListItemText primary="เพิ่มรูปแบบการท่องเที่ยว" />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>

            {/* ปุ่มออกจากระบบด้านล่าง */}
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "#21AC2A",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": {
                            bgcolor: "#ffffff",
                            color: "#21AC2A",
                        },
                    }}
                    onClick={handleLogout}
                >
                    ออกจากระบบ
                </Button>
            </Box>
        </Drawer>
    );
}

export default AdminSideBar