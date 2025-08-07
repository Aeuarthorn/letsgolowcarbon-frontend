import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Switch,
    FormControlLabel,
    Grid,
    Stack,
    MenuItem,
    Select,
    FormControl,
    Snackbar,
    Alert,
    InputLabel,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MainAddPlaces() {
    const { placeType } = useParams();
    console.log("placeType", placeType);
    const [initialLoading, setInitialLoading] = useState(true);
    const [form, setForm] = useState({
        placeType: placeType,  // หมวดที่อยู่
        attractionName: "",  // ชื่อสถานที่
        language: "th",  // ภาษา
        historyDescription: "", // ประวัติความเป็นมา
        activities: "", // กิจกรรม
        cost: "", // ค่าใช้จ่าย
        touristCapacity: "", // การรองรับนักท่องเที่ยว
        openingHours: "", // เวลาทำการ
        touristSeason: "", // ฤดูการท่องเที่ยว
        electricityUsage: "", // การใช้ไฟฟ้า
        waterUsage: "", // การใช้น้ำ
        fuelUsage: "", // การใช้น้ำมัน
        wastewaterManagement: "", // การจัดการน้ำและการเปลี่ยนถ่ายน้ำเสีย
        wasteManagement: "", // การจัดการขยะ
        ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
        contactInfo: "", // ติดต่อสถานที่s
        locationDescription: "", // ที่ตั้ง
        googleMapCoordinates: "", // Google Map (latitude,longitude)
        notes: "", // หมายเหตุ
        uid: null, // ไอดีผู้ลงข้อมูล
        did: null, // ไอดีจังหวัด

    });
    const [district, setDistrict] = useState([]); // จังหวัด
    const [images, setImages] = useState([]); // รูปภาพ
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
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
        if (placeType) {
            setForm((prevForm) => ({
                ...prevForm,
                placeType: placeType, // ตั้งค่า placeType เข้าฟอร์ม
            }));
        }

        fetchData();
    }, [token, placeType]); // ✅ เพิ่ม token ใน dependency array

    console.log("images", images);

    const handleChange = (field) => (event) => {
        const input = event.target;
        console.log("input", input);
        let value = input.value;
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSwitchChange = (event) => {
        setForm((prev) => ({
            ...prev,
            language: event.target.checked ? "th" : "en",
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleCancel = () => {
        // ล้างข้อมูลฟอร์ม
        setForm({
            placeType: "",  // หมวดที่อยู่
            attractionName: "",  // ชื่อสถานที่
            language: "th",  // ภาษา
            bannerImage: "",   // เลือกไฟล์รูป BANNER
            detailedImage: "",   // เลือกไฟล์รูปละเอียด
            historyDescription: "", // ประวัติความเป็นมา
            activities: "", // กิจกรรม
            cost: "", // ค่าใช้จ่าย
            touristCapacity: "", // การรองรับนักท่องเที่ยว
            openingHours: "", // เวลาทำการ
            touristSeason: "", // ฤดูการท่องเที่ยว
            electricityUsage: "", // การใช้ไฟฟ้า
            waterUsage: "", // การใช้น้ำ
            fuelUsage: "", // การใช้น้ำมัน
            wastewaterManagement: "", // การจัดการน้ำและการเปลี่ยนถ่ายน้ำเสีย
            wasteManagement: "", // การจัดการขยะ
            carFootprintPerDay: "", // คาร์ฟุตพริ้นท์/วัน
            ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
            contactInfo: "", // ติดต่อสถานที่s
            locationDescription: "", // ที่ตั้ง
            googleMapCoordinates: "", // Google Map (latitude,longitude)
            notes: "", // หมายเหตุ
            // uid: "", // ไอดีผู้ลงข้อมูล
            // did: "", // ไอดีจังหวัด
        });
    };

    // อัพโหลดรูปภาพ
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // ✅ เริ่มโหลด
        try {
            const decoded = jwtDecode(token);
            const uid = decoded?.uid || decoded?.user_id || null;
            // STEP 1: สร้างสถานที่ (place)
            const placePayload = {
                ...form,
                uid: parseInt(uid),
                carFootprintPerDay: parseFloat(form.carFootprintPerDay),
            };

            const placeRes = await axios.post("http://localhost:8080/create_places", placePayload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("placeRes", placeRes);

            if (placeRes.status === 200 && placeRes.data?.id) {
                // const newPlaceId = 1;
                const newPlaceId = placeRes.data.id;
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
                            console.log("placeType", placeType);


                            formData.append("file", file);
                            formData.append("media_type", mediaType);
                            formData.append("type", img.type || 'default');
                            formData.append("place_type", placeType);
                            formData.append("ref_id", newPlaceId);         // <-- ID จากการสร้าง place
                            formData.append("ref_name", 'place');
                        }
                    });
                }

                console.log("formData", formData);


                const uploadRes = await axios.post("http://localhost:8080/upload_image", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ❌ อย่าตั้ง Content-Type เอง
                    },
                });

                console.log("uploadRes", uploadRes);
                if (uploadRes.status === 200) {
                    setSnackbarMessage("✅ ข้อมูลและรูปภาพถูกบันทึกเรียบร้อยแล้ว!");
                    setSnackbarSeverity("success");
                    // รีเซ็ตฟอร์ม
                    setForm({
                        attractionName: "",  // ชื่อสถานที่
                        language: "th",  // ภาษา
                        historyDescription: "", // ประวัติความเป็นมา
                        activities: "", // กิจกรรม
                        cost: "", // ค่าใช้จ่าย
                        touristCapacity: "", // การรองรับนักท่องเที่ยว
                        openingHours: "", // เวลาทำการ
                        touristSeason: "", // ฤดูการท่องเที่ยว
                        electricityUsage: "", // การใช้ไฟฟ้า
                        waterUsage: "", // การใช้น้ำ
                        fuelUsage: "", // การใช้น้ำมัน
                        wastewaterManagement: "", // การจัดการน้ำและการเปลี่ยนถ่ายน้ำเสีย
                        wasteManagement: "", // การจัดการขยะ
                        carFootprintPerDay: "", // คาร์ฟุตพริ้นท์/วัน
                        ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
                        contactInfo: "", // ติดต่อสถานที่s
                        locationDescription: "", // ที่ตั้ง
                        googleMapCoordinates: "", // Google Map (latitude,longitude)
                        notes: "", // หมายเหตุ
                    });
                    setImages([]);
                } else {
                    setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
                    setSnackbarSeverity("error");
                    throw new Error("Upload failed");
                }
            } else {
                throw new Error("Place creation failed");
            }
        } catch (error) {
            console.error("❗ Error ส่งข้อมูล:", error);
            setSnackbarMessage("⚠️ เกิดข้อผิดพลาดขณะส่งข้อมูล");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false); // ✅ หยุดโหลดเมื่อเสร็จ
            setSnackbarOpen(true);
            setLoading(false); // 🔚 หยุดโหลด
        }
    };

    const placeTypeLabels = {
        tourist_attraction: "สถานที่ท่องเที่ยว",
        hotel: "ที่พัก",
        restaurant: "ร้านอาหาร",
        souvenir: "ร้านของที่ระลึก",
        community_product: "ผลิตภัณฑ์ชุมชน",
    };
    // ลบรูปภาพ
    const handleRemoveImage = (indexToRemove, type) => {
        const updatedImages = images
            .filter((img, index) => !(index === indexToRemove && img.type === type));

        // เคลียร์ memory
        const removedImg = images.find((img, index) => index === indexToRemove && img.type === type);
        if (removedImg?.preview) {
            URL.revokeObjectURL(removedImg.preview);
        }

        setImages(updatedImages);
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: "1000px",
                bgcolor: "#e6f4ea",
                borderRadius: 4,
                color: "#33691e",
                mx: "auto",
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {/* <Typography variant="h6" gutterBottom>
                เพิ่ม: {placeType.replaceAll("_", " ")}
            </Typography> */}
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: "bold" }}>
                {placeTypeLabels[placeType] || placeType.replaceAll("_", " ")}
            </Typography>

            <Grid container spacing={2}>
                {/* ข้อมูลทั่วไป */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                        🗺️ ข้อมูลทั่วไป
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="ชื่อสถานที่"
                        value={form.attractionName}
                        onChange={handleChange("attractionName")}
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel
                            id="district-label"
                            style={{ color: "#558b2f" }}
                        >
                            เลือกอำเภอ
                        </InputLabel>
                        <Select
                            labelId="district-label"
                            // id="district-select"
                            value={form.did}
                            onChange={handleChange("did")}
                            style={{ backgroundColor: "#dcedc8", color: "#33691e" }}
                        >
                            <MenuItem value="">
                                <em>-- เลือกอำเภอ --</em>
                            </MenuItem>
                            {district?.length > 0 &&
                                district.map((d) => (
                                    <MenuItem key={d.did} value={d.did}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "#c8e6c9",
                            borderRadius: 1,
                            p: 1.5,
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.language === "th"}
                                    onChange={handleSwitchChange}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#66bb6a",
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#81c784",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ color: "#33691e", fontWeight: "bold" }}>
                                    ใช้สำหรับภาษา: {form.language}
                                </Typography>
                            }
                        />
                    </Box>
                </Grid>

                {/* ไฟล์ */}
                {/* Banner Place (1 รูป) */}
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูปละเอียด
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={(e) => handleImageUpload(e, "banner_place")}
                        />
                    </Button>


                    {/* แสดง preview banner_place */}
                    <Box sx={{ mt: 1 }}>
                        {images
                            .filter((img) => img.type === "banner_place")
                            .map((img, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <img
                                        src={img.preview}
                                        alt={`banner_place preview ${index}`}
                                        style={{ maxWidth: "100%", maxHeight: 150 }}
                                    />
                                    <Typography variant="body2" sx={{ color: "#33691e" }}>
                                        {img.name}
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
                </Grid>

                {/* Detailed Images (หลายรูป) */}
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูปละเอียด
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={(e) => handleImageUpload(e, "img_detail_place")}
                        />
                    </Button>

                    {/* แสดง preview หลายภาพ พร้อมปุ่มลบ */}
                    <Box sx={{ mt: 1 }}>
                        {images
                            .filter((img) => img.type === "img_detail_place")
                            .map((img, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <img
                                        src={img.preview}
                                        alt={`img_detail_place preview ${index}`}
                                        style={{ maxWidth: "100%", maxHeight: 150 }}
                                    />
                                    <Typography variant="body2" sx={{ color: "#33691e" }}>
                                        {img.name}
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
                </Grid>

                {/* รายละเอียด */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                        📝 รายละเอียด
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="ประวัติและความเป็นมา"
                        multiline
                        minRows={3}
                        value={form.historyDescription}
                        onChange={handleChange("historyDescription")}
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid>

                {[
                    ["กิจกรรม", "activities"],
                    ["ค่าใช้จ่าย", "cost"],
                    ["การรองรับนักท่องเที่ยว", "touristCapacity"],
                    ["เวลาทำการ", "openingHours"],
                    ["ฤดูกาลท่องเที่ยว", "touristSeason"],
                    ["คาร์ฟุตพริ้นท์/วัน", "carFootprintPerDay"],

                ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} key={key}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label={label}
                            value={form[key]}
                            onChange={handleChange(key)}
                            InputProps={{
                                style: {
                                    color: "#33691e",
                                    backgroundColor: "#dcedc8",
                                },
                            }}
                            InputLabelProps={{ style: { color: "#558b2f" } }}
                        />
                    </Grid>
                ))}

                {/* ความยั่งยืน */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                        🌱 ความยั่งยืน & สิ่งแวดล้อม
                    </Typography>
                </Grid>

                {[
                    ["การใช้ไฟฟ้า", "electricityUsage"],
                    ["การใช้น้ำ", "waterUsage"],
                    ["การใช้น้ำมัน", "fuelUsage"],
                    ["การจัดการน้ำและการเปลี่ยนถ่ายน้ำเสีย", "wastewaterManagement"],
                    ["การจัดการขยะ", "wasteManagement"],
                    ["การเปลี่ยนระบบของสถานที่ท่องเที่ยว", "ecoSystemChange"],
                ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} key={key}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label={label}
                            value={form[key]}
                            onChange={handleChange(key)}
                            InputProps={{
                                style: {
                                    color: "#33691e",
                                    backgroundColor: "#dcedc8",
                                },
                            }}
                            InputLabelProps={{ style: { color: "#558b2f" } }}
                        />
                    </Grid>
                ))}

                {/* ติดต่อ */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                        📞 การติดต่อและแผนที่
                    </Typography>
                </Grid>

                {[
                    ["ติดต่อสถานที่", "contactInfo"],
                    ["ที่ตั้ง", "locationDescription"],
                ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} key={key}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label={label}
                            value={form[key]}
                            onChange={handleChange(key)}
                            InputProps={{
                                style: {
                                    color: "#33691e",
                                    backgroundColor: "#dcedc8",
                                },
                            }}
                            InputLabelProps={{ style: { color: "#558b2f" } }}
                        />
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="Google Map (latitude,longitude)"
                        value={form.googleMapCoordinates}
                        onChange={handleChange("googleMapCoordinates")}
                        multiline
                        minRows={2}
                        placeholder="เช่น 16.76031995300121, 103.33303807244201"
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="หมายเหตุ"
                        value={form.notes}
                        onChange={handleChange("notes")}
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid>

                {/* ปุ่ม */}
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="contained" color="error" style={{ color: 'white' }} onClick={handleCancel}>
                        ยกเลิก
                    </Button>
                    <Button variant="contained" color="success" type="submit" disabled={loading}>
                        บันทึก
                    </Button>
                </Grid>
            </Grid>
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
                <CircularProgress    color="inherit" />
            </Backdrop>
        </Box>

    );
}

export default MainAddPlaces