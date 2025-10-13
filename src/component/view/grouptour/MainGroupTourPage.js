import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Divider
} from "@mui/material";
import QRCode from "qrcode.react";
import axios from "axios";
import ModalForCreatGroup from "./modals/ModalForCreatGroup";
import { useNavigate } from "react-router-dom";

export default function MainGroupTourPage() {

    const navigate = useNavigate();
    const [openModalForCreateGroup, setOpenModalForCreateGroup] = useState(false);
    // const [openModalForJoinGroup, setOpenModalForJoinGroup] = useState(false);


    return (
        <Box
            sx={{
                height: "100vh",
                background: "linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
            }}
        >
            {/* ปุ่มสร้างทริป */}
            <Button
                sx={{
                    width: 220,
                    height: 160,
                    borderRadius: 4,
                    background: "linear-gradient(145deg, #799930ff, #acd0b9ff)",
                    color: "white",
                    boxShadow: "6px 6px 12px rgba(0,0,0,0.2)",
                    textTransform: "none",
                    "&:hover": {
                        background: "linear-gradient(145deg, #95d5b2, #74c69d)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
                onClick={() => setOpenModalForCreateGroup(true)}
            >
                <Typography variant="h6" fontWeight="bold">
                    🏞️ สร้างทริป
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">Create Trip</Typography>
            </Button>

            {/* ปุ่มเข้าร่วมทริป */}
                
            <Button
                sx={{
                    width: 220,
                    height: 160,
                    borderRadius: 4,
                   background: "linear-gradient(145deg, #799930ff, #acd0b9ff)",
                    color: "white",
                    boxShadow: "6px 6px 12px rgba(0,0,0,0.2)",
                    textTransform: "none",
                    "&:hover": {
                        background: "linear-gradient(145deg, #52b788, #74c69d)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
                onClick={() => navigate("/tour/join-trip")}
            >
                <Typography variant="h6" fontWeight="bold">
                    🌿เข้าร่วมทริป
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">Joy Trip</Typography>
            </Button>

            {/* เรียกใช้ Modal ที่แยกออกมา */}
            {openModalForCreateGroup ?
                <ModalForCreatGroup
                    open={openModalForCreateGroup}
                    close={setOpenModalForCreateGroup}
                // form={form}
                // handleChange={handleChange}
                // handleSubmit={handleSubmit}
                /> : null
            }
            {/* {openModalForJoinGroup ?
                <ModalForJoinGroup
                    open={openModalForJoinGroup}
                    close={setOpenModalForJoinGroup}
                // form={form}
                // handleChange={handleChange}
                // handleSubmit={handleSubmit}
                /> : null
            }  */}
        </Box>
    );
}
