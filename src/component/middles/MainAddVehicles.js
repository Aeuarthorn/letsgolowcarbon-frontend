import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Paper,
    Card
} from '@mui/material';
import axios from 'axios';
import { fuelsed } from '../api/API';

const FUEL_OPTIONS = [
    'แก๊สโซฮอล์ 91',
    'แก๊สโซฮอล์ 95',
    'แก๊สโซฮอล์ E20',
    'ดีเซล B7',
    'ดีเซล Premium',
    'NGV',
    'LPG',
];
function MainAddVehicles() {
    const [vehicle, setVehicle] = useState({
        name: '',
        efficiency: '',
        fuel_types: [],
    });
    const [fuels, setFuels] = useState([]);
    const token = localStorage.getItem("token");


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

    console.log("fuels", fuels);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    // const handleFuelTypeChange = (event) => {
    //     const { value } = event.target;
    //     setVehicle({ ...vehicle, fuel_types: typeof value === 'string' ? value.split(',') : value });
    // };
    const handleFuelTypeChange = (event) => {
        const {
            target: { value },
        } = event;
        setVehicle({
            ...vehicle,
            fuel_types: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/vehicles', vehicle);
            alert('เพิ่มยานพาหนะสำเร็จ!');
            console.log(res.data);
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
            console.error(err);
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
                    maxWidth: 500,
                    mx: "auto",
                    mt: 6,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(56,142,60,0.3)", // เขียวเข้ม
                    background: "#ffffff",
                }}
            >
                {/* <Typography variant="h5" gutterBottom>
                เพิ่มยานพาหนะ
            </Typography> */}
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="green"
                    gutterBottom
                    textAlign="center"
                >
                    🌿 เพิ่มยานพาหนะ
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="ชื่อยานพาหนะ"
                            name="name"
                            fullWidth
                            value={vehicle.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="ประสิทธิภาพ (กม./ลิตร)"
                            name="efficiency"
                            type="number"
                            fullWidth
                            value={vehicle.efficiency}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>ประเภทน้ำมันที่ใช้ได้</InputLabel>
                            <Select
                                multiple
                                name="fuel_types"
                                value={vehicle.fuel_types}
                                onChange={handleFuelTypeChange}
                                input={<OutlinedInput label="ประเภทน้ำมันที่ใช้ได้" />}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {fuels?.map((fuel) => (
                                    <MenuItem key={fuel.id} value={fuel.name}>
                                        <Checkbox checked={vehicle.fuel_types.indexOf(fuel.name) > -1} />
                                        <ListItemText primary={`${fuel.name} (${fuel.type_car})`} />
                                    </MenuItem>
                                ))}
                            </Select>

                            {/* <Select
                                multiple
                                name="fuel_types"
                                value={vehicle.fuel_types}
                                onChange={handleFuelTypeChange}
                                input={<OutlinedInput label="ประเภทน้ำมันที่ใช้ได้" />}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {FUEL_OPTIONS.map((fuel) => (
                                    <MenuItem key={fuel} value={fuel}>
                                        <Checkbox checked={vehicle.fuel_types.indexOf(fuel) > -1} />
                                        <ListItemText primary={fuel} />
                                    </MenuItem>
                                ))}
                            </Select> */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="right">
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#33691e' }}
                            onClick={handleSubmit}
                        >
                            บันทึก
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
}

export default MainAddVehicles