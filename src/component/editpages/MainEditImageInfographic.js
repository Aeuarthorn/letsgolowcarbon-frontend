import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    styled,
    LinearProgress,
    IconButton,
    Grid,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Close } from "@mui/icons-material";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { travel_admin, update_img_route_banner, upload_image_all } from '../api/API';

// สร้าง input component ที่ซ่อนอยู่
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



function MainEditImageInfographic() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const uid = decoded?.uid || decoded?.user_id || null;

    const [travelRoute, setTravelRoute] = useState([]);
    const [idTravelRouteImg, setIDTravelRouteImg] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });

    // ✅ โหลดเส้นทางทั้งหมด
    useEffect(() => {
        const fetchTravelRoute = async () => {
            if (!token) return;
            setInitialLoading(true);
            try {
                const res = await axios.get(travel_admin, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTravelRoute(res.data || []);

            } catch (error) {
                console.error("โหลดเส้นทางล้มเหลว:", error);
                alert("❌ โหลดข้อมูลเส้นทางล้มเหลว");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchTravelRoute();
    }, [token]);

    console.log("idTravelRouteImg", idTravelRouteImg);

    // ✅ เมื่อเปลี่ยนเส้นทาง
    const handleTravelChangeImg = (e) => {
        setIDTravelRouteImg(e.target.value);
    };

    const handleImageUpload = (e, type) => {
        console.log("e", e);

        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map((file) => ({
                type,
                file,
                name: file.name,
                preview: URL.createObjectURL(file),
            }));

            const otherImages = images.filter((img) => img.type !== type);
            setImages([...otherImages, ...newImages]);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const handleRemoveImage = (type, indexToRemove) => {
        // ลบเฉพาะภาพในกลุ่ม type นั้น ๆ
        const updatedImages = images?.filter((img, index) => {
            if (img.type !== type) return true; // เก็บไว้ถ้าคนละ type
            // ถ้า type เดียวกัน ให้ลบเฉพาะตัวที่ตรง index ของกลุ่มนั้น
            const sameTypeImages = images?.filter((i) => i.type === type);
            const targetImage = sameTypeImages[indexToRemove];
            return img !== targetImage;
        });

        setImages(updatedImages);
    };

    // ✅ ฟังก์ชันอัปโหลด
    const handleSubmit = async () => {
        if (!idTravelRouteImg) {
            alert("กรุณาเลือกเส้นทางก่อนอัปโหลด");
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            const newRouteId = idTravelRouteImg;
            const types = [...new Set(images.map((img) => img.type))];
            const uploadedPaths = [];

            for (const type of types) {
                const imagesOfType = images.filter((img) => img.type === type);
                if (imagesOfType.length === 0) continue;

                const formDataUpload = new FormData();
                imagesOfType.forEach((img) => {
                    formDataUpload.append("files", img.file);
                });

                formDataUpload.append("media_type", "image");
                formDataUpload.append("type", type);
                formDataUpload.append("place_type", "route");
                formDataUpload.append("ref_id", newRouteId);
                formDataUpload.append("ref_name", "route");

                console.log("Uploading images for type:", type, imagesOfType.length);

                const uploadRes = await axios.post(upload_image_all, formDataUpload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percent);
                    },
                });
                console.log("uploadRes", uploadRes);

                // ✅ ดึง path ออกจาก response ที่ถูกต้อง
                const results = uploadRes.data?.data?.results || [];
                const paths = results.map((r) => r.file_path).filter(Boolean);

                // ✅ ตรวจว่ามี path ไหม
                if (paths.length > 0) {
                    uploadedPaths.push(...paths);
                } else {
                    throw new Error(`การอัปโหลด ${type} สำเร็จแต่ไม่ได้รับ path กลับมา`);
                }
            }

            if (uploadedPaths.length > 0) {
                setErrorSnackbar({
                    open: true,
                    message: "✅ อัปโหลดรูปภาพสำเร็จ!",
                    severity: "success",
                });
                console.log("Uploaded paths:", uploadedPaths);
            } else {
                setErrorSnackbar({
                    open: true,
                    message: "❌ ไม่มีรูปใดถูกอัปโหลดสำเร็จ",
                    severity: "error",
                });
            }

            // ✅ Reset ค่าหลังอัปโหลดสำเร็จ
            setImages([]);
            setProgress(0);
        } catch (error) {
            console.error("Upload error:", error);
            setErrorSnackbar({
                open: true,
                message: `❌ อัปโหลดล้มเหลว: ${error.message}`,
                severity: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4, md: 6 }, // เพิ่ม padding ด้านข้างสำหรับจอใหญ่
                // backgroundColor: 'background.default', // ใช้สีพื้นหลังจาก Theme
                minHeight: "100vh",
            }}
        >
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">

                {/* -------------------- ส่วนแก้ไขรูปภาพ -------------------- */}
                {/* แก้ไขรูปภาพ */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        maxWidth: 700,
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                        align="center"
                        color="primary" // ใช้สีเขียวจาก theme
                        sx={{ fontWeight: 'bold' }}
                    >
                        แก้ไขรูปภาพอินโฟกราฟฟิก 📸
                    </Typography>

                    <Stack spacing={3} mt={3}>
                        {/* Select เส้นทาง */}
                        <FormControl fullWidth disabled={uploading}>
                            <InputLabel id="travel-route-select-img-label">เลือกเส้นทาง</InputLabel>
                            <Select
                                labelId="travel-route-select-img-label"
                                id="travel-route-select-img"
                                value={idTravelRouteImg}
                                label="เลือกเส้นทาง"
                                onChange={handleTravelChangeImg}
                                color="primary"
                            >
                                {travelRoute?.map((route) => (
                                    <MenuItem key={route.tid} value={route.tid}>
                                        {route.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* อัปโหลดรูป */}
                        <Box gridColumn="span 2">
                            <Typography fontWeight="bold" color="green" mb={1}>
                                📷 อัปโหลดรูปภาพอินโฟกราฟฟิก
                            </Typography>
                            <Button variant="contained" component="label" color="success" fullWidth>
                                เลือกรูปอินโฟกราฟฟิกเส้นทาง
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={(e) => handleImageUpload(e, "info_route")}
                                />
                            </Button>
                            <Box mt={2}>
                                {images
                                    .filter((img) => img.type === "info_route")
                                    .map((img, index) => (
                                        <Box key={index} sx={{ mt: 1 }}>
                                            <img
                                                src={img.preview}
                                                alt={`preview-${index}`}
                                                style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: 8 }}
                                            />
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2">{img.name}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveImage(img.type, index)} // ✅ ส่ง type ด้วย
                                                    sx={{ color: "red" }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>

                        {/* Progress Bar */}
                        {uploading && (
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <LinearProgress variant="determinate" value={progress} color="primary" />
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                    กำลังอัปโหลด... {Math.round(progress)}%
                                </Typography>
                            </Box>
                        )}

                        {/* ปุ่ม */}
                        <Box sx={{ pt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={handleRemoveImage}
                                sx={{ width: '50%' }}
                                disabled={uploading}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ width: '50%' }}
                                disabled={uploading}
                            >
                                {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
            <Snackbar
                open={errorSnackbar.open}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbar({ open: false, message: "" })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ fontWeight: "bold" }}
                >
                    {errorSnackbar.message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* Loading Overlay */}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={initialLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* ฟอร์มหลักของคุณ */}
        </Box>
    )
}

export default MainEditImageInfographic