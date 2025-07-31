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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MainAddPlaces() {
    const { placeType } = useParams();
    const [form, setForm] = useState({
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
        ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
        contactInfo: "", // ติดต่อสถานที่s
        locationDescription: "", // ที่ตั้ง
        googleMapCoordinates: "", // Google Map (latitude,longitude)
        notes: "", // หมายเหตุ
        uid: null, // ไอดีผู้ลงข้อมูล
        did: null, // ไอดีจังหวัด

    });
    const [district, setDistrict] = useState([]); // จังหวัด
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
            }
        };

        fetchData();
    }, [token]); // ✅ เพิ่ม token ใน dependency array


    const handleChange = (field) => (event) => {
        console.log("field", field);
        console.log("event.target.type", event.target.type);

        const value = event.target.type === "file"
            ? event.target.files[0]
            : event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleChangedis = (field) => (event) => {
        setForm((prev) => ({
            ...prev,
            [field]: event.target.value,
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
            ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
            contactInfo: "", // ติดต่อสถานที่s
            locationDescription: "", // ที่ตั้ง
            googleMapCoordinates: "", // Google Map (latitude,longitude)
            notes: "", // หมายเหตุ
            // uid: "", // ไอดีผู้ลงข้อมูล
            // did: "", // ไอดีจังหวัด
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const decoded = jwtDecode(token);
        console.log("Token decoded:", decoded);
        try {
            const uid = decoded?.uid || decoded?.user_id || null;
            const payload = {
                ...form,
                uid: parseInt(uid),
            }
            console.log("payload", payload);
            console.log("form", form);


            // เขียน logic บันทึกข้อมูลที่นี่
            console.log(form);
            const response = await axios.post(
                "http://localhost:8080/create_places",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setSnackbarMessage("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
                setSnackbarSeverity("success");
                // เคลียร์ค่าฟอร์ม
                // setRoute("");
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
                    ecoSystemChange: "", // การเปลี่ยนระบบของสถานที่ท่องเที่ยว
                    contactInfo: "", // ติดต่อสถานที่s
                    locationDescription: "", // ที่ตั้ง
                    googleMapCoordinates: "", // Google Map (latitude,longitude)
                    notes: "", // หมายเหตุ
                    // uid: "", // ไอดีผู้ลงข้อมูล
                    // did: "", // ไอดีจังหวัด
                });
            } else {
                setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.error("❗ Error ส่งข้อมูล:", error);
            setSnackbarMessage("⚠️ เกิดข้อผิดพลาดขณะส่งข้อมูล");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
            setLoading(false); // 🔚 หยุดโหลด
        }
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
            <Typography variant="h6" gutterBottom>
                เพิ่ม: {placeType.replaceAll("_", " ")}
            </Typography>

            <Grid container spacing={2}>
                {/* ข้อมูลทั่วไป */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูป banner
                        <input type="file" hidden onChange={handleChange("bannerImage")} />
                    </Button>
                    {form.bannerImage && (
                        <Typography variant="body2" sx={{ color: "#33691e", mt: 1 }}>
                            {form.bannerImage.name}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูปละเอียด
                        <input type="file" hidden onChange={handleChange("detailedImage")} />
                    </Button>
                    {form.detailedImage && (
                        <Typography variant="body2" sx={{ color: "#33691e", mt: 1 }}>
                            {form.detailedImage.name}
                        </Typography>
                    )}
                </Grid>

                {/* รายละเอียด */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
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
                    <Button variant="contained" color="success" type="submit">
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
        </Box>

    );
}

export default MainAddPlaces