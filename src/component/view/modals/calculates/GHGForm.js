import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Paper,
    Button,
    Switch,
    FormControlLabel,
    Collapse,
    Divider,
} from '@mui/material';

const categories = [
    {
        title: 'การเดินทาง',
        subItems: [
            {
                name: 'จักรยานยนต์',
                factor: 0.0579,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'motorcycle_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'motorcycle_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'motorcycle_passengers' },
                ],
            },
            {
                name: 'รถยนต์ส่วนบุคคล',
                factor: 0.1622,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'car_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'car_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'car_passengers' },
                ],
            },
            {
                name: 'รถยนต์ไฟฟ้า',
                factor: 0.0756,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'ev_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'ev_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'ev_passengers' },
                ],
            },
            {
                name: 'รถกระบะ',
                factor: 0.2486,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'pickup_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'pickup_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'pickup_passengers' },
                ],
            },
            {
                name: 'รถตู้',
                factor: 0.2686,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'van_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'van_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'van_passengers' },
                ],
            },
            {
                name: 'รถโดยสาร-รถประจำทาง',
                factor: 0.03,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'bus_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'bus_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'bus_passengers' },
                ],
            },
            {
                name: 'เที่ยวบินในประเทศ',
                factor: 0.17,
                fields: [
                    { label: 'ระยะทางเฉลี่ยไป (กม.)', name: 'flight_distanceGo' },
                    { label: 'ระยะทางเฉลี่ยกลับ (กม.)', name: 'flight_distanceBack' },
                    { label: 'จำนวนผู้โดยสาร (คน)', name: 'flight_passengers' },
                ],
            },
        ],
    },
    {
        title: 'อาหารและเครื่องดื่ม',
        subItems: [
            { name: 'อาหารหลักปกติ', factor: 3.93, fields: [{ label: 'จำนวนชุดอาหาร (ชุด)', name: 'normal_meal' }] },
            { name: 'อาหารหลักมังสวิรัติ', factor: 1.12, fields: [{ label: 'จำนวนชุดอาหาร (ชุด)', name: 'veg_meal' }] },
            { name: 'อาหารหลักว่างปกติและเครื่องดื่ม', factor: 0.21, fields: [{ label: 'จำนวนชุดอาหาร (ชุด)', name: 'snack_meal' }] },
            { name: 'อาหารหลักว่างปกติและเครื่องดื่มมังสวิรัติ', factor: 0.14, fields: [{ label: 'จำนวนชุดอาหาร (ชุด)', name: 'veg_snack_meal' }] },
        ],
    },
    {
        title: 'การพักแรม',
        subItems: [
            {
                name: 'โรงแรม 1 and 2 Star',
                factor: 6.08,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'hotel12_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'hotel12_nights' },
                ],
            },
            {
                name: 'โรงแรม 3 Star',
                factor: 8.10,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'hotel3_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'hotel3_nights' },
                ],
            },
            {
                name: 'โรงแรม 4 Star',
                factor: 9.148,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'hotel4_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'hotel4_nights' },
                ],
            },
            {
                name: 'โรงแรม 5 Star',
                factor: 14.21,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'hotel5_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'hotel5_nights' },
                ],
            },
            {
                name: 'โฮมสเตย์ไม่มีเครื่องปรับอากาศ',
                factor: 0.28,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'homestay_noAC_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'homestay_noAC_nights' },
                ],
            },
            {
                name: 'โฮมสเตย์มีเครื่องปรับอากาศ',
                factor: 3.13,
                fields: [
                    { label: 'จำนวนผู้เข้าพัก (คน)', name: 'homestay_AC_guests' },
                    { label: 'จำนวนวันเข้าพัก', name: 'homestay_AC_nights' },
                ],
            },
        ],
    },
    {
        title: 'ของเสีย',
        subItems: [
            { name: 'เศษอาหาร(ใช้ปริมาณภาชนะ)', factor: 2.53, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'food_container' }] },
            { name: 'กระดาษ', factor: 2.93, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'paper_waste' }] },
            { name: 'พลาสติก', factor: 2.32, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'plastic_waste' }] },
            { name: 'ผ้า', factor: 2.00, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'fabric_waste' }] },
            { name: 'เศษอาหาร', factor: 2.53, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'food_waste' }] },
            { name: 'ไม้', factor: 2.33, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'wood_waste' }] },
            { name: 'อื่นๆ', factor: 2.52, fields: [{ label: 'ปริมาณของเสีย (kg)', name: 'other_waste' }] },
        ],
    },
];

export function GHGForm({ registerStepCallback }) {
    const [openSections, setOpenSections] = useState({});
    const [formData, setFormData] = useState({});
    const [results, setResults] = useState({});

    const handleToggle = (title) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const handleChange = (name) => (e) => {
        setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // ฟังก์ชันคำนวณแยกหมวด
    const calculateCategory = (category) => {
        let total = 0;
        const breakdown = [];

        category.subItems.forEach(({ name, factor, fields }) => {
            // ตรวจว่ามีการกรอกค่าครบอย่างน้อย 1 ช่องก่อนคำนวณ
            const isAnyFieldFilled = fields.some(({ name: fieldName }) => {
                const val = formData[fieldName];
                return val !== undefined && val !== '' && !isNaN(parseFloat(val));
            });

            if (!isAnyFieldFilled) return; // ข้ามถ้ายังไม่กรอกข้อมูล

            // คำนวณตามสูตรเฉพาะของแต่ละหมวด
            let result = 0;
            if (category.title === 'การเดินทาง') {
                const go = parseFloat(formData[fields[0].name]) || 0;
                const back = parseFloat(formData[fields[1].name]) || 0;
                const people = parseFloat(formData[fields[2].name]) || 0;
                result = ((go * factor) + (back * factor)) * people;
            } else if (category.title === 'อาหารและเครื่องดื่ม') {
                const quantity = parseFloat(formData[fields[0].name]) || 0;
                result = quantity * factor;
            } else if (category.title === 'การพักแรม') {
                const guests = parseFloat(formData[fields[0].name]) || 0;
                const nights = parseFloat(formData[fields[1].name]) || 0;
                result = guests * nights * factor;
            } else if (category.title === 'ของเสีย') {
                const weight = parseFloat(formData[fields[0].name]) || 0;
                result = weight * factor;
            } else {
                let value = 1;
                fields.forEach(({ name: fieldName }) => {
                    const inputVal = parseFloat(formData[fieldName]) || 0;
                    value *= inputVal;
                });
                result = value * factor;
            }

            breakdown.push({ name, result });
            total += result;
        });

        const updatedResults = {
            ...results,
            [category.title]: {
                total,
                breakdown,
            },
        };

        setResults(updatedResults);
    };


    useEffect(() => {
        if (!registerStepCallback) return;

        registerStepCallback(() => {
            const dataforLocal = {
                travel: parseFloat((results['การเดินทาง']?.total || 0).toFixed(4)),
                foodanddrink: parseFloat((results['อาหารและเครื่องดื่ม']?.total || 0).toFixed(4)),
                stay: parseFloat((results['การพักแรม']?.total || 0).toFixed(4)),
                waste: parseFloat((results['ของเสีย']?.total || 0).toFixed(4)),
            };

            localStorage.setItem('ghg_totals', JSON.stringify(dataforLocal));
            return true;
        });
    }, [registerStepCallback, results]);


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={3}>
                ข้อมูลกิจกรรมเพื่อการคำนวณคาร์บอนฟุตพริ้นต์
            </Typography>

            {categories.map((category) => (
                <Paper
                    key={category?.title}
                    sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2, backgroundColor: '#ffffff' }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{category?.title}</Typography>
                        <FormControlLabel
                            control={<Switch checked={!!openSections[category?.title]} onChange={() => handleToggle(category?.title)} />}
                            label={openSections[category?.title] ? 'ซ่อน' : 'แสดง'}
                        />
                    </Box>

                    <Collapse in={!!openSections[category?.title]}>
                        <Divider sx={{ my: 2 }} />
                        {category?.subItems.map(({ name, fields }) => (
                            <Box key={name} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {name}
                                </Typography>
                                <Grid container spacing={2}>
                                    {fields?.map(({ label, name: fieldName }) => (
                                        <Grid key={fieldName} item xs={12} sm={6} md={4}>
                                            <TextField
                                                label={label}
                                                name={fieldName}
                                                fullWidth
                                                type="number"
                                                value={formData[fieldName] || ''}
                                                onChange={handleChange(fieldName)}
                                                InputProps={{ inputProps: { min: 0 } }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={() => calculateCategory(category)}>
                                คำนวณ
                            </Button>
                        </Box>
                    </Collapse>
                    {results[category?.title] && (
                        <Box mt={2} p={2} bgcolor="#e0f7fa" borderRadius={1}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                ผลการคำนวณสำหรับ {category.title} (kgCO2eq)
                            </Typography>
                            {results[category?.title].breakdown.map(({ name, result }) => (
                                <Typography key={name}>• {name}: {result.toFixed(4)} kgCO2eq</Typography>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body1" fontWeight="bold">
                                รวมทั้งหมด: {results[category?.title].total.toFixed(4)} kgCO2eq
                            </Typography>
                        </Box>
                    )}
                </Paper>
            ))}

        </Box>
    );
}
