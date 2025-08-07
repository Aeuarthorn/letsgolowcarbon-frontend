import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Backdrop, CircularProgress, Alert, Snackbar, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { CheckCircleOutline } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

function MainAddDistrict() {
    const [districts, setDistricts] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const token = localStorage.getItem('token');
    const [images, setImages] = useState([]); // รูปภาพ
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

    // ฟังก์ชันสำหรับบันทึกข้อมูลอำเภอ
    const handleSave = async () => {
        console.log('ข้อมูลอำเภอที่บันทึก:', districts);
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/create_district', { name: districts, },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // NEW
                // const newDistrctId = 6;
                const newDistrctId = response.data.id;
                const formData = new FormData();
                // STEP 2: เตรียมอัปโหลดภาพ (image & video)
                if (Array.isArray(images)) {
                    images.forEach((img, index) => {
                        console.log("img++++", img);

                        if (img.file instanceof File) {
                            const file = img.file;
                            const fileName = file.name;
                            const extension = fileName.split('.').pop().toLowerCase();

                            const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension);
                            const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(extension);
                            const mediaType = isImage ? 'image' : isVideo ? 'video' : 'unknown';

                            if (mediaType === 'unknown') return;

                            console.log("mediaType", mediaType);
                            console.log("img.type", img.type);


                            formData.append("file", file);
                            formData.append("media_type", mediaType);
                            formData.append("type", img.type || 'default');
                            formData.append("place_type", "district");
                            formData.append("ref_id", newDistrctId);         // <-- ID จากการสร้าง place
                            formData.append("ref_name", 'dsitrict');
                        }
                    });
                }

                console.log("formData", formData);
                const uploadRes = await axios.post("http://localhost:8080/upload_image_banner", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ❌ อย่าตั้ง Content-Type เอง
                    },
                });

                console.log("uploadRes", uploadRes);


                if (uploadRes.status === 200) {
                    setSnackbarMessage("✅ ข้อมูลและรูปภาพถูกบันทึกเรียบร้อยแล้ว!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true); // ← ตรงนี้แสดง snackbar
                    setImages([]);

                } else {
                    setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true); // ← แสดง snackbar

                }
            } else {
                throw new Error("Place creation failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดขณะเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // ลบ preview เก่าเพื่อป้องกัน memory leak
            images
                .filter((img) => img.type === type)
                .forEach((img) => {
                    if (img.preview) {
                        URL.revokeObjectURL(img.preview);
                    }
                });

            // สร้าง preview ใหม่
            const newImages = files.map((file) => ({
                type,
                file,
                name: file.name,
                entityID: null,
                preview: URL.createObjectURL(file),
            }));

            // รวมกับภาพประเภทอื่น
            const otherImages = images.filter((img) => img.type !== type);
            setImages([...otherImages, ...newImages]);
        }
    };

    return (
        <Box
            sx={{
                // backgroundColor: "#e8f5e9", // เขียวจาง
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
                        เพิ่มจังหวัด
                    </Typography>
                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="ชื่อจังหวัด"
                            variant="outlined"
                            value={districts}
                            onChange={(e) => setDistricts(e.target.value)}
                            sx={{
                                mb: 3,
                                backgroundColor: '#ffffff',
                            }}
                        />
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" component="label" color="primary" fullWidth>
                                อัพรูปอำเภอ
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={(e) => handleImageUpload(e, "banner")}
                                />
                            </Button>


                            {/* แสดง preview banner */}
                            <Box sx={{ mt: 1 }}>
                                {images
                                    .filter((img) => img.type === "banner")
                                    .map((img, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                            <img
                                                src={img.preview}
                                                alt={`banner preview ${index}`}
                                                style={{ maxWidth: "100%", maxHeight: 150 }}
                                            />
                                            <Typography variant="body2" sx={{ color: "#33691e" }}>
                                                {img.name}
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>

                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            // disabled={!districts || loading}
                            sx={{ borderRadius: '8px', py: 1.5, fontWeight: 'bold' }}
                        >
                            บันทึก
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            {/* Snackbar Success */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: snackbarSeverity === 'success' ? '#c8e6c9' : '#ffcdd2',
                        color: snackbarSeverity === 'success' ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Loading Overlay */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default MainAddDistrict