import { Close } from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
    Snackbar, // 👈 เพิ่ม
    Alert // 👈 เพิ่ม
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { add_trip_group, district_admin, district_guest, travel_types_admin, travel_types_guest, upload_qrcode } from "../../../api/API";

function ModalForCreatGroup({ open, close }) {
    // 💡 แก้ไข: ใช้ `users` เป็นชื่อตัวแปรที่ชัดเจนขึ้น
    const token = localStorage.getItem("token");
    const userCreator = localStorage?.getItem("name");
    const [images, setImages] = useState([]);
    const [district, setDistrict] = useState([]);
    const [travelType, setTravelType] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // 👈 เพิ่ม State ใหม่นี้
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

    const [form, setForm] = useState({
        did: "",
        type_car: "",
        ttid: 0,
        num_people: 0,
        descriptions: "",
    });
    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setInitialLoading(true);
            try {
                const [resDistrict, resTravelType] = await Promise.all([
                    axios.get(district_guest, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(travel_types_guest, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setDistrict(resDistrict.data);
                setTravelType(resTravelType.data);
                setIsDataReady(true);
            } catch (err) {
                setErrorSnackbar({
                    open: true,
                    message: "โหลดข้อมูลล้มเหลว",
                });
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    console.log("images", images);


    // ฟังก์ชันตรวจสอบความถูกต้อง
    const validateForm = (currentForm, currentImages) => {
        // 1. ตรวจสอบ Fields ที่จำเป็น
        const requiredFields = ["did", "type_car", "ttid", "descriptions"];
        const allFieldsValid = requiredFields.every(field =>
            currentForm[field] !== "" && currentForm[field] !== 0 && currentForm[field] !== null
        );

        // 2. ตรวจสอบจำนวนคน (ต้องมากกว่า 0)
        const numPeopleValid = currentForm.num_people > 0;

        // 3. ตรวจสอบรูปภาพ QR Code (ต้องมีอย่างน้อย 1 รูปประเภท 'qrcode')
        const qrCodeValid = currentImages.some(img => img.type === "qrcode");

        return allFieldsValid && numPeopleValid && qrCodeValid;
    };

    const handleChange = (field) => (event) => {
        const newForm = { ...form, [field]: event.target.value }; // 👈 เก็บฟอร์มใหม่
        setForm(newForm);
        // 👈 เรียกตรวจสอบความถูกต้องและอัปเดตปุ่ม
        setIsFormValid(validateForm(newForm, images));
    };

    const handleImageUpload = (e, type) => {
        setLoading(true)
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            // ... (โค้ดจัดการไฟล์เดิม) ...
            const fileToUpload = files[0];
            const newImages = [{
                type,
                file: fileToUpload,
                name: fileToUpload.name,
                preview: URL.createObjectURL(fileToUpload)
            }];
            const otherImages = images.filter((img) => img.type !== type);
            const updatedImages = [...otherImages, ...newImages]; // 👈 เก็บ Images ใหม่

            setImages(updatedImages);
            // 👈 เรียกตรวจสอบความถูกต้องและอัปเดตปุ่ม
            setIsFormValid(validateForm(form, updatedImages));

            setLoading(false)
        }
    };
    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);

        if (images[indexToRemove]?.type === 'qrcode') {
            setForm(prevForm => ({ ...prevForm, qrCode: null }));
        }

        // 👈 เรียกตรวจสอบความถูกต้องและอัปเดตปุ่ม
        setIsFormValid(validateForm(form, updatedImages));
    };
    // const handleImageUpload = (e, type) => {
    //     setLoading(true)
    //     const files = Array.from(e.target.files);

    //     if (files.length > 0) {
    //         const fileToUpload = files[0];

    //         // 1. จัดการการแสดงผล Preview (อัปเดต State 'images')
    //         const newImages = [{
    //             type,
    //             file: fileToUpload,
    //             name: fileToUpload.name,
    //             preview: URL.createObjectURL(fileToUpload),
    //         }];

    //         const otherImages = images.filter((img) => img.type !== type);
    //         setImages([...otherImages, ...newImages]);

    //         // // 2. ✅ สำคัญ: อัปเดต State 'form' สำหรับส่งข้อมูล
    //         // if (type === "qrcode") {
    //         //     setForm(prevForm => ({ ...prevForm, qrCode: fileToUpload }));
    //         // }
    //     }
    // };

    // const handleRemoveImage = (indexToRemove) => {
    //     const updatedImages = images.filter((_, index) => index !== indexToRemove);
    //     setImages(updatedImages);
    //     // 💡 ถ้าลบรูป QR Code ต้องเคลียร์ qrCode ใน form ด้วย
    //     if (images[indexToRemove]?.type === 'qrcode') {
    //         setForm(prevForm => ({ ...prevForm, qrCode: null }));
    //     }
    // };

    // 🛑 NEW: ฟังก์ชันปิด Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        setSnackbarMessage("✅ ข้อมูลและรูปภาพถูกบันทึกเรียบร้อยแล้ว!");
    };

    const handleSubmit = async () => {
        setLoading(true); // ✅ เริ่มโหลด
        try {
            const decoded = jwtDecode(token);
            const uid = decoded?.uid || decoded?.user_id || null;
            const types = [...new Set(images.map((img) => img.type))];

            // ⚠️ Array to collect all successful image paths
            const uploadedPaths = [];

            // 🌀 Loop through each type and upload
            for (const type of types) {
                const imagesOfType = images.filter((img) => img.type === type);
                if (imagesOfType.length === 0) continue;

                const formDataUpload = new FormData();
                imagesOfType.forEach((img) => {
                    formDataUpload.append("files", img.file);
                });

                formDataUpload.append("media_type", "image");
                formDataUpload.append("type", type);
                formDataUpload.append("place_type", "qrcode");
                formDataUpload.append("ref_name", "qrcode");

                console.log("Uploading images for type:", type, imagesOfType.length);

                // --- 🛑 CRITICAL FIX: Use .data to access response payload ---
                const uploadRes = await axios.post(upload_qrcode, formDataUpload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Assuming your upload API returns a JSON object like { success: true, url: "uploads/..." }
                const path = uploadRes.data?.url || uploadRes.data?.path; // ✅ Adjust key based on API

                if (path) {
                    uploadedPaths.push(path); // ✅ Collect the path
                } else {
                    throw new Error(`Upload for type ${type} succeeded but no path was returned.`);
                }
            } // End of upload loop

            const finalPath = uploadedPaths.length > 0 ? uploadedPaths[uploadedPaths.length - 1] : "";

            if (!finalPath && images.length > 0) {
                setSnackbarMessage("❌ การอัปโหลดรูปภาพล้มเหลวทั้งหมด");
                return; // Exit and keep loading state true until finally block
            }

            const index = finalPath.indexOf("/uploads/");
            const pathFromUploads = index !== -1 ? finalPath?.substring(index + 1) : finalPath;

            const placePayload = {
                ...form,
                path: pathFromUploads, // ✅ Use the determined path
                uid: parseInt(uid),
            };

            console.log("placePayload", placePayload);

            // 5. Send data to API
            const placeRes = await axios.post(add_trip_group, placePayload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (placeRes.status === 200) {
                console.log("Trip created successfully.");
                setSnackbarMessage("✅ ข้อมูลและรูปภาพถูกบันทึกเรียบร้อยแล้ว!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true); // 👈 ✅ เปิด Snackbar เมื่อสำเร็จ
                setImages([]);
                handleClose();
            } else {
                // ❌ กรณี API ตอบกลับมาแต่สถานะไม่สำเร็จ
                setSnackbarMessage("❌ บันทึกข้อมูลไม่สำเร็จ (Status: " + placeRes.status + ")");
                setSnackbarSeverity("error");
                setSnackbarOpen(true); // 👈 ✅ เปิด Snackbar เมื่อล้มเหลว
            }

        } catch (error) {
            // ❌ แสดงข้อความ Error (Failure Snackbar)
            console.error("Error submitting form:", error);
            setSnackbarMessage(`❌ เกิดข้อผิดพลาด: ${error.message || "ไม่ทราบสาเหตุ"}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true); // 👈 ✅ เปิด Snackbar เมื่อเกิด Exception
        } finally {
            setLoading(false); // ✅ Ensure loading state is turned off
        }

    };

    const handleClose = () => {
        close(false);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >

                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "#f6fff8",
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90vh",     // ✅ จำกัดความสูงไม่เกิน 90% ของ viewport
                        overflowY: "auto",     // ✅ เปิดการเลื่อนแนวตั้งเมื่อเนื้อหาเกิน
                        scrollbarWidth: "thin", // (optional) ทำ scrollbar ให้เล็ก
                    }}
                >

                    <Typography
                        variant="h5"
                        textAlign="center"
                        fontWeight="bold"
                        color="green"
                        mb={3}
                    >
                        🏞️ สร้างทริปใหม่
                    </Typography>

                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                        {/* เลือกอำเภอ */}
                        <FormControl fullWidth>
                            <InputLabel>เลือกอำเภอ</InputLabel>
                            <Select
                                value={form.did}
                                onChange={handleChange("did")}
                                label="เลือกอำเภอ"
                            >
                                <MenuItem value="">
                                    <em>-- เลือกอำเภอ --</em>
                                </MenuItem>
                                {district?.length > 0 &&
                                    district?.map((d) => (
                                        <MenuItem key={d.did} value={d.did}>
                                            {d.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* การเดินทาง */}
                        <FormControl fullWidth>
                            <InputLabel>การเดินทาง</InputLabel>
                            <Select
                                value={form.type_car}
                                onChange={handleChange("type_car")}
                                label="การเดินทาง"
                            >
                                <MenuItem value="car">รถยนต์</MenuItem>
                                <MenuItem value="van">รถตู้</MenuItem>
                                <MenuItem value="motorcy">จักรยาน</MenuItem>
                            </Select>
                        </FormControl>

                        {/* จำนวนวัน */}
                        <FormControl fullWidth>
                            <InputLabel>จำนวนวัน</InputLabel>
                            <Select
                                value={form.ttid}
                                onChange={handleChange("ttid")}
                                label="จำนวนวัน"
                            >
                                <MenuItem value="">
                                    <em>-- เลือกประเภท --</em>
                                </MenuItem>
                                {travelType?.length > 0 &&
                                    travelType?.map((d) => (
                                        <MenuItem key={d.ttid} value={d.ttid}>
                                            {d.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* จำนวนคน */}
                        <TextField
                            fullWidth
                            label="จำนวนคน"
                            variant="outlined"
                            type="num"
                            value={form.people}
                            onChange={handleChange("num_people")}
                            inputProps={{ min: 1 }}
                        />

                        {/* รายละเอียด */}
                        <Box gridColumn="span 2">
                            <TextField
                                fullWidth
                                label="รายละเอียดทริปคร่าว ๆ"
                                multiline
                                rows={3}
                                value={form.descriptions}
                                onChange={handleChange("descriptions")}
                            />
                        </Box>

                        {/* ✅ อัปโหลดรูป QR Code กลุ่มไลน์ */}
                        <Box gridColumn="span 2">
                            <Typography fontWeight="bold" color="green" mb={1}>
                                📷 อัปโหลดรูป QR Code กลุ่มไลน์
                            </Typography>
                            <Button variant="contained" component="label" color="success" fullWidth>
                                เลือกรูปคิวอาร์โค้ด
                                <input
                                    type="file"
                                    accept="image/*"
                                    // multiple 💡 ลบออกดีกว่าถ้าต้องการแค่รูปเดียว
                                    hidden
                                    onChange={(e) => handleImageUpload(e, "qrcode")}
                                />
                            </Button>

                            <Box mt={2}>
                                {images
                                    .filter((img) => img.type === "qrcode")
                                    .map((img, index) => (
                                        <Box key={index} sx={{ mt: 1 }}>
                                            <img
                                                src={img.preview}
                                                alt={`preview-${index}`}
                                                style={{ maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
                                            />
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2">{img.name}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveImage(index)}
                                                    sx={{ color: "red" }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading || initialLoading || !isFormValid}
                            sx={{
                                bgcolor: "green",
                                px: 5,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: "bold",
                                "&:hover": { bgcolor: "darkgreen" },
                            }}
                        >
                            ✅ ยืนยัน
                        </Button>
                    </Box>

                </Box>
            </Modal>
            {/* 🛑 ส่วนที่เพิ่ม 1: Backdrop/Loading Indicator */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
                open={loading} // 👈 ใช้ state 'loading' ที่คุณประกาศไว้
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* 🛑 ส่วนที่เพิ่ม 2: Snackbar (ข้อความแจ้งเตือน) */}
            <Snackbar
                open={snackbarOpen} // 👈 ใช้ state 'snackbarOpen'
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity} // 👈 ใช้ state 'snackbarSeverity'
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage} {/* 👈 ใช้ state 'snackbarMessage' */}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ModalForCreatGroup;