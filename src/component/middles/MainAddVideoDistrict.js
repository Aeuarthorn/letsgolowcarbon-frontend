import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Paper,
    InputLabel,
    IconButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Backdrop,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { CloudUpload, PlayCircleOutline } from '@mui/icons-material';
import { useEffect } from 'react';
import axios from 'axios';


function MainAddVideoDistrict() {
    const [videoFile, setVideoFile] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [district, setDistrict] = useState([]); // จังหวัด
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [form, setForm] = useState({
        video: videoURL,  // หมวดที่อยู่
        did: '', // ไอดีจังหวัด

    });
    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"


    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setInitialLoading(true);
            setLoading(true);
            try {
                const resDistrict = await axios.get("http://localhost:8080/district", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("resDistrict", resDistrict.data);
                setDistrict(resDistrict.data);
            } catch (err) {
                console.error("Fetch district error:", err);
                setErrorSnackbar({
                    open: true,
                    message: "โหลดข้อมูลล้มเหลว",
                });
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [token]); // ✅ เพิ่ม token ใน dependency array

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // const handleVideoUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setVideoFile(file);
    //         setVideoURL(URL.createObjectURL(file));
    //     }
    // };
    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoURL(url); // ✅ ตั้งค่าตรงนี้เพื่อให้โชว์ preview
        }
    };
    // const handleVideoUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setVideoFile(file);
    //         setVideoURL(URL.createObjectURL(file));
    //     }
    // };

    const handleChange = (field) => (event) => {
        let value = event.target.value;
        if (field === "did") {
            value = Number(value); // แปลงให้เป็น int
        }
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!videoFile || form.did === 0) {
            setErrorSnackbar({
                open: true,
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
            });
            return;
        }
        console.log("videoFile", videoFile);
        console.log("form.did", form.did);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("video", videoFile); // ไฟล์ .mp4
            formData.append("media_type", "video");
            formData.append("place_type", "district");
            formData.append("ref_id", form.did); // เช่น 103
            formData.append("ref_name", "district");
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const uploadVDO = await axios.post("http://localhost:8080/uploads_video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            // const uploadVDO = await axios.post("http://localhost:8080/uploads_video", formData, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            console.log("uploadVDO", uploadVDO);
            if (uploadVDO.status === 200) {
                setSnackbarMessage("อัปโหลดวิดีโอสำเร็จ");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                // Reset state
                setVideoFile('');
                setVideoURL('');
                setForm({ ...form, did: 0 });
            } else {
                setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
                setSnackbarSeverity("error");
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setSnackbarMessage("เกิดข้อผิดพลาดในการอัปโหลด");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100vh' }}>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <Paper elevation={4} sx={{ p: 4, mt: 5, backgroundColor: '#e8f5e9', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom color="green" fontWeight="bold">
                    อัปโหลดวิดีโอ
                </Typography>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel
                            id="district-video-label"
                            style={{ color: "#558b2f" }}
                        >
                            เลือกอำเภอ
                        </InputLabel>
                        <Select
                            labelId="district-video-label"
                            value={form.did}
                            onChange={handleChange("did")}
                            style={{ backgroundColor: "#dcedc8", color: "#33691e" }}
                        >
                            <MenuItem value={0}>
                                <em>-- เลือกอำเภอ --</em>
                            </MenuItem>
                            {district?.length > 0 &&
                                district.map((d) => (
                                    <MenuItem key={d.did} value={Number(d.did)}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box mt={2} mb={2}>
                        <InputLabel>ไฟล์วิดีโอ</InputLabel>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUpload />}
                            sx={{
                                backgroundColor: 'green',
                                '&:hover': { backgroundColor: 'darkgreen' },
                                mt: 1,
                            }}
                        >
                            เลือกวิดีโอ
                            <input hidden accept="video/*" type="file" onChange={handleVideoUpload} />
                        </Button>
                    </Box>
                </Grid>
                {videoURL && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" fontWeight="bold" color="green">
                            ตัวอย่างวิดีโอ
                        </Typography>
                        <video width="100%" height="auto" controls>
                            <source src={videoURL} type={videoFile?.type || "video/mp4"} />
                            เบราว์เซอร์ของคุณไม่รองรับการแสดงวิดีโอ
                        </video>
                    </Box>
                )}


                <Box textAlign="center" mt={4}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        startIcon={<PlayCircleOutline />}
                        sx={{ px: 4, py: 1 }}
                    >
                        อัปโหลด
                    </Button>
                </Box>
            </Paper>
            {/* // JSX ส่วนแสดง error Snackbar */}
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
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={initialLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}

export default MainAddVideoDistrict