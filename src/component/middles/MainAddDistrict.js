import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Backdrop, CircularProgress, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { CheckCircleOutline } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

function MainAddDistrict() {
    const [districts, setDistricts] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const token = localStorage.getItem('token');

    // ฟังก์ชันสำหรับบันทึกข้อมูลอำเภอ
    const handleSave = async () => {
        console.log('ข้อมูลอำเภอที่บันทึก:', districts);
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/create_district',
                {
                    name: districts,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setOpenSnackbar(true); // แสดง snackbar
                setDistricts('');
            } else {
                alert("เกิดข้อผิดพลาด: " + response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดขณะเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    bgcolor: '#e8f5e9', // light green earth tone
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <Typography variant="h5" align="center" gutterBottom color="green">
                    เพิ่มจังหวัด
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="ชื่อจังหวัด"
                        variant="outlined"
                        value={districts}
                        onChange={(e) => setDistricts(e.target.value)}
                        sx={{
                            mb: 3,
                            backgroundColor: '#ffffff',
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={handleSave}
                        disabled={!districts || loading}
                        sx={{ borderRadius: '8px', py: 1.5, fontWeight: 'bold' }}
                    >
                        บันทึก
                    </Button>
                </Box>
            </Paper>
            {/* Snackbar Success */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1500}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: '#c8e6c9', // ✅ เขียวจาง (Green[100])
                        color: '#2e7d32',           // ✅ สีข้อความเขียวเข้ม
                        fontWeight: 'bold',
                    }}
                >
                    บันทึกสำเร็จ
                </Alert>
            </Snackbar>
            {/* Loading Overlay */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}

export default MainAddDistrict