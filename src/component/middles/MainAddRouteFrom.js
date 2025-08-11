import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    IconButton,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Card,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useEffect } from 'react';

// const vehicleOptions = [
//     {
//         id: 1,
//         name: 'มอเตอร์ไซค์',
//         typeCar: 'motorcy',
//         efficiency: 40,
//         fuelTypes: ['แก๊สโซฮอล์ 91', 'แก๊สโซฮอล์ 95', 'แก๊สโซฮอล์ E20'],
//     },
//     {
//         id: 2,
//         name: 'รถยนต์',
//         typeCar: 'car',
//         efficiency: 15,
//         fuelTypes: ['แก๊สโซฮอล์ 91', 'แก๊สโซฮอล์ 95', 'แก๊สโซฮอล์ E20'],
//     },
//     {
//         id: 3,
//         name: 'รถตู้',
//         typeCar: 'van',
//         efficiency: 10,
//         fuelTypes: ['ดีเซล B7', 'ดีเซล Premium'],
//     },
// ];

function MainAddRouteFrom() { // เพิ่มข้อมูลการเดินทางแบบใหม่
    const [formData, setFormData] = useState({
        tid: 0,
        origin: '',
        destination: '',
        distance_km: '',
        vehicles: [],
    });

    const [snack, setSnack] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [travel, setTravel] = useState([]); // 👉 ลิสต์ข้อมูลจาก API
    const [travelRoute, setTravelRoute] = useState([]); // 👉 ลิสต์ข้อมูลจาก API
    const [vehicleOptions, setvehicleOptions] = useState([]); // 👉 ลิสต์ข้อมูลจาก API
    const [selectedTravelses, setSelectedTravelses] = useState(""); // 👉 tid ที่ถูกเลือก
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error" | "warning" | "info"
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleClose = () => setSnack((s) => ({ ...s, open: false }));

    useEffect(() => {
        loadTravelses();
        loadVehicleOptions();
    }, []);

    const handletravelsesChange = (event) => {
        const tid = event.target.value;
        setSelectedTravelses(tid); // ✅ เก็บค่า tid ที่เลือก
        console.log("🆔 tid ที่เลือก:", tid);
        setFormData({ ...formData, tid: tid || selectedTravelses })
        LoadTravelRoute(tid)
    };

    console.log("formData", formData);
    console.log("travelRoute", travelRoute);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadTravelses = async () => {
        setIsLoading(true)
        try {
            const resTravel = await axios.get("http://localhost:8080/travel", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("resTravel.data ", resTravel.data);
            
            setTravel(resTravel.data || []); // ตรวจสอบรูปแบบ data ด้วย (array?)
            console.log("✅ ดึงข้อมูลเส้นทางสำเร็จ:", resTravel.data);
            setIsLoading(false)

        } catch (error) {
            console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
            setIsLoading(false)
        }
    };
    const loadVehicleOptions = async () => {
        setIsLoading(true)
        try {
            const resTravel = await axios.get("http://localhost:8080/vehicle_with_fuels", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setvehicleOptions(resTravel.data || []); // ตรวจสอบรูปแบบ data ด้วย (array?)
            console.log("✅ ดึงข้อมูลขนาดยานพาหนะสำเร็จ:", resTravel.data);
            setIsLoading(false)
        } catch (error) {
            console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
            setIsLoading(false)
        }
    };

    const LoadTravelRoute = async (tid) => {
        const resTravelRoute = await axios.post("http://localhost:8080/travel_route", { tid: tid }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("resTravelRoute.data", resTravelRoute.data);

        setTravelRoute(resTravelRoute.data || []); // ตรวจสอบรูปแบบ data ด้วย (array?)
    }

    const handleVehicleChange = (index, key, value) => {
        const updatedVehicles = [...formData.vehicles];
        updatedVehicles[index][key] = value;
        setFormData({ ...formData, vehicles: updatedVehicles });
    };

    const handleAddVehicle = () => {
        setFormData({
            ...formData,
            vehicles: [...formData.vehicles, { name: '', efficiency: '', fuelTypes: [] }],
        });
    };

    const handleRemoveVehicle = (index) => {
        const updatedVehicles = formData.vehicles.filter((_, i) => i !== index);
        setFormData({ ...formData, vehicles: updatedVehicles });
    };

    const isFormDataValid = (data) => {
        console.log("data", data);

        if (!data.tid) {
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        console.log("ข้อมูลที่ส่ง:", formData);

        // เริ่มโหลด
        setIsLoading(true);

        if (!isFormDataValid(formData)) {
            setSnack({
                open: true,
                message: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนส่ง",
                severity: "error",
            });
            setIsLoading(false); // ยกเลิกโหลดเมื่อข้อมูลไม่ครบ
            return;
        }

        try {
            const res = await axios.post('http://localhost:8080/create_route_vehicles', formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                });
            console.log(res.data);
            setSnackbarMessage("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
            setSnackbarSeverity("success");
            // ✅ เคลียร์ฟอร์ม แต่เก็บ tid ไว้
            const selectedTid = formData.tid;
            setFormData({
                tid: selectedTid,
                origin: "",
                destination: "",
                distance_km: "",
                vehicles: [],
            });
        } catch (err) {
            console.error(err);
            setSnackbarMessage("❌ ไม่สามารถบันทึกข้อมูลได้");
            setSnackbarSeverity("error");
        } finally {
            // หยุดโหลดไม่ว่าจะสำเร็จหรือ fail
            setSnackbarOpen(true);
            setIsLoading(false);
        }
    };



    return (
        <Box
            sx={{
                minHeight: "100vh",
                p: 4,
            }}
        >
            <Card
                sx={{
                    maxWidth: 800,
                    mx: "auto",
                    mt: 6,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(56,142,60,0.3)", // เขียวเข้ม
                    background: "#ffffff",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="green"
                    gutterBottom
                    textAlign="center"
                >
                    🌿 เพิ่มเส้นทางใหม่
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="travelses-select-label">เส้นทาง</InputLabel>
                            <Select
                                name="travelses-select"
                                labelId="travelses-select-label"
                                id="travelses-select"
                                value={selectedTravelses} // ✅ ใช้ค่าที่เลือก
                                label="เส้นทาง"
                                onChange={handletravelsesChange}
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1,
                                }}
                            >
                                <MenuItem value="">
                                    <em>-- เลือกเส้นทาง --</em>
                                </MenuItem>
                                {travel?.map((d) => (
                                    <MenuItem key={d.tid} value={d.tid}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        {/* <TextField
                            label="ต้นทาง"
                            fullWidth
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        /> */}
                        <FormControl fullWidth>
                            <InputLabel id="origin-select-label">ต้นทาง</InputLabel>
                            <Select
                                name="origin-select"
                                labelId="origin-select-label"
                                id="origin-select"
                                label="ต้นทาง"
                                fullWidth
                                value={formData.origin}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    console.log("เลือกแล้ว:", selectedValue);
                                    setFormData({ ...formData, origin: selectedValue });
                                }}
                            // onChange={(e) => 
                            //     setFormData({ ...formData, origin: e.target.value })
                            // }
                            >
                                <MenuItem value="">
                                    <em>-- เลือกต้นทาง --</em>
                                </MenuItem>
                                {travelRoute?.map((d, index) => (
                                    <MenuItem key={`${d.tid}-${index}`} value={d.name}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <TextField
                            label="ปลายทาง"
                            fullWidth
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        /> */}
                        <FormControl fullWidth>
                            <InputLabel id="destination-select-label">ปลายทาง</InputLabel>
                            <Select
                                name="destination-select"
                                labelId="destination-select-label"
                                id="destination-select"
                                label="ปลายทาง"
                                fullWidth
                                value={formData.destination}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    console.log("เลือกแล้ว:", selectedValue);
                                    setFormData({ ...formData, destination: selectedValue });
                                }}
                            // onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            >
                                <MenuItem value="">
                                    <em>-- เลือกปลายทาง --</em>
                                </MenuItem>
                                {travelRoute?.map((d, index) => (
                                    <MenuItem key={`${d.tid}-${index}`} value={d.name}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="ระยะทาง (กิโลเมตร)"
                            fullWidth
                            type="number"
                            value={formData.distance_km}
                            onChange={(e) => setFormData({ ...formData, distance_km: parseFloat(e.target.value) })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">ยานพาหนะในเส้นทางนี้</Typography>
                    </Grid>

                    {formData.vehicles.map((vehicle, index) => {
                        console.log("vehicle", vehicle);

                        return (
                            <Grid item xs={12} key={index}>
                                <Paper sx={{ p: 2, backgroundColor: '#f1f8e9' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>ประเภท</InputLabel>
                                                <Select
                                                    value={vehicle.name}
                                                    label="ประเภท"
                                                    onChange={(e) => {
                                                        const selected = vehicleOptions.find((v) => v.name === e.target.value);
                                                        handleVehicleChange(index, 'name', selected.name);
                                                        handleVehicleChange(index, 'efficiency', selected.efficiency);
                                                        handleVehicleChange(index, 'fuelTypes', selected.fuelTypes);
                                                        handleVehicleChange(index, 'typeCar', selected.typeCar); // ✅ เก็บ typeCar
                                                        handleVehicleChange(index, 'fid', selected.id);          // ✅ เก็บ id ลงใน fid
                                                    }}
                                                >
                                                    {vehicleOptions.map((option) => (
                                                        <MenuItem key={option.name} value={option.name}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} sm={6}>
                                            <TextField
                                                label="กม./ลิตร"
                                                type="number"
                                                fullWidth
                                                value={vehicle.efficiency}
                                                onChange={(e) =>
                                                    handleVehicleChange(index, 'efficiency', parseFloat(e.target.value))
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>น้ำมันที่ใช้</InputLabel>
                                                <Select
                                                    multiple
                                                    value={vehicle.fuelTypes}
                                                    onChange={(e) =>
                                                        handleVehicleChange(index, 'fuelTypes', e.target.value)
                                                    }
                                                >
                                                    {[
                                                        'แก๊สโซฮอล์ 91',
                                                        'แก๊สโซฮอล์ 95',
                                                        'แก๊สโซฮอล์ E20',
                                                        'ดีเซล B7',
                                                        'ดีเซล Premium',
                                                    ].map((fuel) => (
                                                        <MenuItem key={fuel} value={fuel}>
                                                            {fuel}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton color="error" onClick={() => handleRemoveVehicle(index)}>
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )
                    })}

                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddVehicle}
                            sx={{ mt: 1 }}
                        >
                            เพิ่มยานพาหนะ
                        </Button>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        {/* <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ backgroundColor: '#33691e', color: 'white' }}
                        >
                            บันทึกเส้นทาง
                        </Button> */}
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            variant="contained"
                            color="primary"
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </Button>

                    </Grid>
                </Grid>
            </Card>
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snack.severity}
                    sx={{ width: "100%" }}
                >
                    {snack.message}
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

export default MainAddRouteFrom