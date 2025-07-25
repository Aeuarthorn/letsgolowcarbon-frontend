import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, } from '@mui/material';
import * as React from 'react';

export function TourTypeForm({ registerStepCallback }) {
    const [value, setValue] = React.useState('adventure');

    React.useEffect(() => {
        registerStepCallback(() => {
            localStorage.setItem('tourtype', value);
            return true; // บอกว่า validate ผ่าน ไปหน้าต่อไปได้
        });
    }, [value, registerStepCallback]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#d0fbea', borderRadius: 2 }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
                ประเภทการท่องเที่ยว
            </Typography>

            <FormControl fullWidth>
                <RadioGroup
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    <FormControlLabel value="adventure" control={<Radio />} label="การท่องเที่ยวเชิงนิเวศและผจญภัย" />
                    <FormControlLabel value="agriculture" control={<Radio />} label="การท่องเที่ยวเชิงเกษตร" />
                    <FormControlLabel value="food" control={<Radio />} label="การท่องเที่ยวเชิงอาหาร" />
                    <FormControlLabel value="health" control={<Radio />} label="การท่องเที่ยวเชิงสุขภาพ" />
                    <FormControlLabel value="culture" control={<Radio />} label="การท่องเที่ยวเชิงวัฒนธรรม" />
                    <FormControlLabel value="inclusive" control={<Radio />} label="การท่องเที่ยวเพื่อคนทั้งมวล" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}
