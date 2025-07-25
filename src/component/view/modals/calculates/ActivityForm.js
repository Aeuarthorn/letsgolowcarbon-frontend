import React from 'react';
import { Box, TextField, Typography, Grid, Paper } from '@mui/material';

export function ActivityForm({ registerStepCallback }) {
    const [formData, setFormData] = React.useState({
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        tourists: '',
    });

    // Update field
    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    // Register callback for "ต่อไป"
    React.useEffect(() => {
        registerStepCallback(() => {
            // Optional: Validate if needed before saving
            if (!formData.name || !formData.location) {
                alert('กรุณากรอกชื่อกิจกรรมและสถานที่ท่องเที่ยว');
                return false;
            }

            localStorage.setItem('activity', JSON.stringify(formData));
            return true;
        });
    }, [formData, registerStepCallback]);


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#d0fbea', borderRadius: 2 }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
                ประเภทกิจกรรมท่องเที่ยว
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="ชื่อกิจกรรม"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange('name')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="สถานที่ท่องเที่ยว"
                        fullWidth
                        variant="outlined"
                        value={formData.location}
                        onChange={handleChange('location')}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="วันเริ่มโปรแกรมเที่ยว"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={formData.startDate}
                        onChange={handleChange('startDate')}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="วันสิ้นสุดโปรแกรมเที่ยว"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={formData.endDate}
                        onChange={handleChange('endDate')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="จำนวนนักท่องเที่ยว"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.tourists}
                        onChange={handleChange('tourists')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
