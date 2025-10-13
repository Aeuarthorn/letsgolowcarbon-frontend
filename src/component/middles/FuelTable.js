import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    TextField, IconButton,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { create_fuels, delete_fuels, edit_fuels, fuelsed } from "../api/API";

function FuelTable() {
    const [fuels, setFuels] = useState([]);
    const [open, setOpen] = useState(false);
    const [editFuel, setEditFuel] = useState(null);
    const [formData, setFormData] = useState({ type_car: '', name: '', price: 0.0, co2_per_l: 0.0 });
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // หรือ "error"

    const fetchFuels = async () => {
        const res = await axios.get(fuelsed,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        console.log("res.data", res.data);
        setFuels(res.data);
    };

    useEffect(() => {
        fetchFuels();
    }, []);

    const handleOpen = (fuel = null) => {
        setEditFuel(fuel);
        if (fuel) {
            setFormData(fuel);
        } else {
            setFormData({ type_car: '', name: '', price: 0.0, co2_per_l: 0.0 });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditFuel(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editFuel) {
                await axios.put(`${edit_fuels}/${editFuel.ID}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSnackbarMessage("✅ แก้ไขข้อมูลสำเร็จ");
            } else {
                await axios.post(create_fuels, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSnackbarMessage("✅ เพิ่มข้อมูลสำเร็จ");
            }

            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            await fetchFuels();
            handleClose();
        } catch (err) {
            console.error('Error saving fuel:', err);
            setSnackbarMessage("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
            await axios.delete(`${delete_fuels}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchFuels();
        }
    };

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 2 },
                // backgroundColor: "#f0f8e0",
                minHeight: "100vh",
            }}
        >

            <TableContainer component={Paper} sx={{ mt: 4, p: 2 }}>
                {/* <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center' }} gutterBottom>
                    ตารางราคาน้ำมัน
                </Typography> */}
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="green"
                    gutterBottom
                    textAlign="center"
                >
                    🌿 ตารางราคาน้ำมัน
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle1"
                            align="left"
                            color="text.secondary"
                            sx={{ ml: 2 }}
                        >
                            ราคาน้ำมันวันที่ 10 ตุลาคม 2567
                        </Typography>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ pr: 2 }}>
                            <Button variant="contained" onClick={() => handleOpen()} sx={{ background: "#33691e", m: 2, textAlign: 'end' }}>
                                เพิ่มน้ำมัน
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ลำดับ</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ปรเภทรถ</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ชื่อ</TableCell>

                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ราคา (บาท/ลิตร)</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>การกินน้ำมัน (kg/ลิตร)</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>แก้ไข</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fuels?.map((fuel, index) => (
                            <TableRow key={fuel.id}>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                    {index + 1}
                                </TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{
                                    fuel.type_car === "motorcy" ? "มอเตอร์ไซต์"
                                        : fuel.type_car === "car" ? "รถยนต์"
                                            : fuel.type_car === "van" && "รถตู้"
                                }</TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{fuel.name}</TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{fuel.price}</TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{fuel.co2_per_l}</TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                    <IconButton color="primary" onClick={() => handleOpen(fuel)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                    <IconButton color="error" onClick={() => handleDelete(fuel.ID)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Dialog สำหรับเพิ่ม/แก้ไข */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editFuel ? 'แก้ไขข้อมูลน้ำมัน' : 'เพิ่มข้อมูลน้ำมัน'}</DialogTitle>
                    <DialogContent>
                        {/* ตัวอย่าง Select เพิ่มเติม (เลือกประเภทรถ) */}
                        <Box
                            sx={{ m: 2 }}
                        >
                            <FormControl fullWidth>
                                <InputLabel
                                    id="type-car-label"
                                >
                                    ประเภทรถ
                                </InputLabel>
                                <Select
                                    labelId="type-car-label"
                                    id="type-car"
                                    value={formData.type_car}
                                    label="ประเภทรถ"
                                    onChange={(e) => setFormData({ ...formData, type_car: e.target.value })}
                                >

                                    <MenuItem value={"motorcy"}>มอเตอร์ไซค์</MenuItem>
                                    <MenuItem value={"car"}>รถยนต์</MenuItem>
                                    <MenuItem value={"van"}>รถตู้</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="ชื่อ"
                                name="name"
                                fullWidth
                                margin="normal"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <TextField
                                label="ราคา (บาท/ลิตร)"
                                name="price"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                                }
                            />
                            <TextField
                                label="CO2 (kg/ลิตร)"
                                name="co2_per_l"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formData.co2_per_l}
                                onChange={(e) =>
                                    setFormData({ ...formData, co2_per_l: parseFloat(e.target.value) })
                                }
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>ยกเลิก</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            บันทึก
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default FuelTable