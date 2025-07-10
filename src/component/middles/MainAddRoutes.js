import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    Divider,
} from '@mui/material';
import { UploadFile, Close } from '@mui/icons-material';


function MainAddRoutes() {
    const [formData, setFormData] = useState({
        name: '',
        language: '',
        brandImage: null,
        infographicImage: null,
        district: '',
        routeType: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleRemoveFile = (fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: null,
        }));
    };

    const handleReset = () => {
        setFormData({
            name: '',
            language: '',
            brandImage: null,
            infographicImage: null,
            district: '',
            routeType: '',
        });
    };



    function UploadBox({ label, name, onChange, file, onRemove }) {
        const [previewUrl, setPreviewUrl] = useState(null);

        useEffect(() => {
            if (file && file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                return () => URL.revokeObjectURL(url); // Clean up
            } else {
                setPreviewUrl(null);
            }
        }, [file]);

        return (
            <Box
                component="label"
                sx={{
                    border: '2px dashed green',
                    borderRadius: 2,
                    textAlign: 'center',
                    p: 3,
                    cursor: 'pointer',
                    color: 'green',
                    backgroundColor: '#f1fdf3',
                    '&:hover': {
                        backgroundColor: '#e0f7ea',
                    },
                    width: '250px',
                    position: 'relative',
                }}
            >
                <UploadFile sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1">{label}</Typography>
                <Typography variant="caption" color="text.secondary">
                    คลิกเพื่อเลือกไฟล์ (เฉพาะรูปภาพ)
                </Typography>

                <input
                    hidden
                    type="file"
                    accept="image/*"
                    name={name}
                    onChange={onChange}
                />

                {previewUrl && (
                    <Box mt={2} sx={{ position: 'relative' }}>
                        <img
                            src={previewUrl}
                            alt="preview"
                            style={{
                                width: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                            }}
                        />
                        {/* ปุ่มลบรูป */}
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation(); // ป้องกันให้คลิกไม่เปิด file dialog
                                onRemove();
                            }}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                            }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                {!previewUrl && file && (
                    <Typography mt={2} fontSize={14}>
                        📁 {file.name}
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            sx={{ ml: 1, color: 'red' }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Typography>
                )}
            </Box>
        );

    }


    const handleSubmit = () => {
        if (!formData.name || !formData.language || !formData.district || !formData.routeType) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        console.log(formData);
    };

    return (
        <Box sx={{ p: 4, backgroundColor: '#f0fdf4', minHeight: '100vh' }}>
            <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 4, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="green" gutterBottom>
                        🛣️ เพิ่มเส้นทาง (Add Route)
                    </Typography>

                    <Grid container spacing={3} >
                        <Grid item xs={12}>
                            <TextField
                                label="ชื่อเส้นทาง"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        {/* รอเรียกจากฐานข้อมูล */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>ใช้สำหรับภาษา</InputLabel>
                                <Select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    label="ใช้สำหรับภาษา"
                                >
                                    <MenuItem value="TH">ภาษาไทย</MenuItem>
                                    <MenuItem value="EN">English</MenuItem>
                                    <MenuItem value="CN">中文</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* รูปภาพแบรนด์ & อินโฟกราฟฟิก (แถวเดียว) */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                    >
                                        <UploadBox
                                            label="อัปโหลดรูปภาพแบรนด์"
                                            name="brandImage"
                                            file={formData.brandImage}
                                            onChange={handleChange}
                                            onRemove={() => handleRemoveFile('brandImage')}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                    >
                                        <UploadBox
                                            label="อัปโหลดอินโฟกราฟฟิก"
                                            name="infographicImage"
                                            file={formData.infographicImage}
                                            onChange={handleChange}
                                            onRemove={() => handleRemoveFile('infographicImage')}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* รอดึงข้อมูลตาม อำเภอในฐานข้อมูล */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>อำเภอ</InputLabel>
                                        <Select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            label="อำเภอ"
                                        >
                                            <MenuItem value="เมือง">เมือง</MenuItem>
                                            <MenuItem value="แม่ริม">แม่ริม</MenuItem>
                                            <MenuItem value="จอมทอง">จอมทอง</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>รูปแบบเส้นทาง</InputLabel>
                                        <Select
                                            name="routeType"
                                            value={formData.routeType}
                                            onChange={handleChange}
                                            label="รูปแบบเส้นทาง"
                                        >
                                            <MenuItem value="เดิน">เดิน</MenuItem>
                                            <MenuItem value="รถยนต์">รถยนต์</MenuItem>
                                            <MenuItem value="จักรยาน">จักรยาน</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* เส้นคั่น */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} /> {/* เพิ่ม margin Y = 3 */}
                        </Grid>
                        {/* ปุ่ม รีเซต + บันทึก (แถวเดียว) */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={handleReset}
                                        sx={{
                                            borderColor: 'gray',
                                            color: 'gray',
                                            '&:hover': { backgroundColor: '#e8f5e9' },
                                        }}
                                    >
                                        รีเซต
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleSubmit}
                                        sx={{
                                            backgroundColor: 'green',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#2e7d32',
                                            },
                                        }}
                                    >
                                        บันทึกข้อมูล
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default MainAddRoutes