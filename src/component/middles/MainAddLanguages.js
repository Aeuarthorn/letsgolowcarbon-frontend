import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import axios from "axios";
import { create_language } from "../api/API";

function MainAddLanguages() {
    const [language, setLanguage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const token = localStorage.getItem("token");
    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async () => {
        if (!language.trim()) {
            setErrorSnackbar({
                open: true,
                message: "กรุณากรอกชื่อภาษา",
            });
            return;
        }

        if (!token) {
            setErrorSnackbar({
                open: true,
                message: "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่",
            });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                local: language.trim(),
            };

            console.log("✅ ส่งภาษา:", payload);

            const response = await axios.post(
                create_language,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setOpenSnackbar(true);
                setLanguage(""); // รีเซตฟิลด์
            } else {
                setErrorSnackbar({
                    open: true,
                    message: `เกิดข้อผิดพลาด: ${response.statusText}`,
                });
            }
        } catch (err) {
            console.error("❌ Error:", err);
            setErrorSnackbar({
                open: true,
                message: "เกิดข้อผิดพลาดในการเชื่อมต่อหรือ Token ไม่ถูกต้อง",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#e8f5e9", // เขียวจาง
                minHeight: "100vh",
                p: 4,
            }}
        >
            <Card
                sx={{
                    maxWidth: 500,
                    mx: "auto",
                    mt: 6,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(56,142,60,0.3)", // เขียวเข้ม
                    background: "#ffffff",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="green"
                        gutterBottom
                        textAlign="center"
                    >
                        🌿 เพิ่มภาษาใหม่
                    </Typography>

                    <TextField
                        label="ชื่อภาษา (เช่น Thai, English, 中文)"
                        variant="outlined"
                        fullWidth
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        sx={{ mt: 3, mb: 4 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "green",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#2e7d32",
                            },
                        }}
                        onClick={handleSubmit}
                    >
                        บันทึกภาษา
                    </Button>
                </CardContent>
            </Card>

            <Snackbar
                open={errorSnackbar.open}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbar({ open: false, message: "" })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" variant="filled" sx={{ fontWeight: 'bold' }}>
                    {errorSnackbar.message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: '#c8e6c9',
                        color: '#2e7d32',
                        fontWeight: 'bold',
                    }}
                >
                    เพิ่มภาษาสำเร็จ
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default MainAddLanguages