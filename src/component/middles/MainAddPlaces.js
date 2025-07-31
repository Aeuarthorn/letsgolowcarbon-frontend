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

function MainAddPlaces() {
    const { placeType } = useParams();
    const [form, setForm] = useState({
        name: "",  // ชื่อสถานที่
        // usage: "th",  // ภาษา
        img_main: "",   // รูปหลักของสถานที่
        history_and_background: "", // ประวัติความเป็นมา
        detail: "", 


        quantity: "",
        bannerFile: null,
        detailFile: null,
        history: "",
        activity: "",
        expense: "",
        tourControl: "",
        // food: "",
        tourismSeason: "",
        electricityUsage: "",
        waterUsage: "",
        garbageUsage: "",
        waterTreatment: "",
        cleaning: "",
        tourismSystemChange: "",
        contact: "",
        address: "",
        remark: "",
        googleMap: "",
    });
    const [district, setDistrict] = useState([]); // จังหวัด
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState({
        open: false,
        message: "",
    });

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
            usage: event.target.checked ? "th" : "en",
        }));
    };

    const handleCancel = () => {
        // ล้างข้อมูลฟอร์ม
        setForm({
            name: "",
            // usage: "TH",
            quantity: "",
            bannerFile: null,
            detailFile: null,
            history: "",
            activity: "",
            expense: "",
            tourControl: "",
            food: "",
            tourismSeason: "",
            electricityUsage: "",
            waterUsage: "",
            garbageUsage: "",
            waterTreatment: "",
            cleaning: "",
            tourismSystemChange: "",
            contact: "",
            address: "",
            remark: "",
            googleMap: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("form", form);


        // เขียน logic บันทึกข้อมูลที่นี่
        console.log(form);
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
                        value={form.name}
                        onChange={handleChange("name")}
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
                            id="district-select"
                            value={form.district}
                            onChange={handleChange("district")}
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
                                    checked={form.usage === "th"}
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
                                    ใช้สำหรับภาษา: {form.usage}
                                </Typography>
                            }
                        />
                    </Box>
                </Grid>

                {/* ไฟล์ */}
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูป banner
                        <input type="file" hidden onChange={handleChange("bannerFile")} />
                    </Button>
                    {form.bannerFile && (
                        <Typography variant="body2" sx={{ color: "#33691e", mt: 1 }}>
                            {form.bannerFile.name}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" component="label" color="success" fullWidth>
                        เลือกไฟล์ รูปละเอียด
                        <input type="file" hidden onChange={handleChange("detailFile")} />
                    </Button>
                    {form.detailFile && (
                        <Typography variant="body2" sx={{ color: "#33691e", mt: 1 }}>
                            {form.detailFile.name}
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
                        value={form.history}
                        onChange={handleChange("history")}
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        variant="filled"
                        label="จำนวน"
                        value={form.quantity}
                        onChange={handleChange("quantity")}
                        InputProps={{
                            style: {
                                color: "#33691e",
                                backgroundColor: "#dcedc8",
                            },
                        }}
                        InputLabelProps={{ style: { color: "#558b2f" } }}
                    />
                </Grid> */}

                {[
                    ["กิจกรรม", "activity"],
                    ["ค่าใช้จ่าย", "expense"],
                    ["การรองรับนักท่องเที่ยว", "quantity"],
                    ["เวลาทำการ", "time"],
                    ["ฤดูกาลท่องเที่ยว", "tourismSeason"],
                    // ["อาหารการ", "food"],

                    
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
                    // ["การควบคุมที่เกี่ยวกับท่องเที่ยว", "tourControl"],
                    ["การใช้ไฟฟ้า", "electricityUsage"],
                    ["การใช้น้ำ", "waterUsage"],
                    ["การใช้น้ำมัน", "oil"],
                    ["การจัดการน้ำและการเปลี่ยนถ่ายน้ำเสีย", "waterTreatment"],
                    ["การจัดการขยะ", "garbageUsage"],
                    // ["การทำความสะอาด", "cleaning"],
                    ["การเปลี่ยนระบบของสถานที่ท่องเที่ยว", "tourismSystemChange"],
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
                    ["ติดต่อสถานที่", "contact"],
                    ["ที่ตั้ง", "address"],
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
                        value={form.googleMap}
                        onChange={handleChange("googleMap")}
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
                        value={form.remark}
                        onChange={handleChange("remark")}
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
        </Box>

    );
}

export default MainAddPlaces