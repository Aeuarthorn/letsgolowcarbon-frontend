import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip
} from '@mui/material';

const attractionsData = {
    'อำเภอเมือง': [
        {
            name: 'บึงแก่นนคร',
            description: 'บึงแก่นนคร หรือสมัยในอดีตคือ บึงขอน บึงบอน เป็นบึงรูปวงรี...',
            image: '/images/buengkaennakorn.jpg',
        },
        {
            name: 'บึงสีฐาน',
            description: 'บึงสีฐาน ขนาดประมาณ 3 ไร่ เหมาะแก่การพักผ่อน...',
            image: '/images/buengsithan.jpg',
        },
        {
            name: 'วัดหนองแวง',
            description: 'พระมหาธาตุแก่นนคร ตั้งอยู่ในบริเวณวัดหนองแวง...',
            image: '/images/watnongwaeng.jpg',
        },
        {
            name: 'Columbo Craft Village',
            description: '“Columbo Craft Village” จังหวัดขอนแก่น...',
            image: '/images/columbo.jpg',
        },
        {
            name: 'KHONKAEN EXOTIC PET & NIGHT SAFARI',
            description: 'สวนสัตว์แปลกและไนท์ซาฟารี เปิดให้บริการตั้งแต่ปี 2561...',
            image: '/images/exoticpet.jpg',
        },
        {
            name: 'พิพิธภัณฑ์ธรรมชาติวิทยา',
            description: 'พิพิธภัณฑ์ตั้งอยู่ภายในมหาวิทยาลัยขอนแก่น...',
            image: '/images/naturemuseum.jpg',
        },
    ],
    'อำเภอภูผาม่าน': [
        {
            name: 'น้ำตกตาดฟ้า',
            description: 'น้ำตกขนาดใหญ่ในเขตอุทยานภูผาม่าน...',
            image: '/images/tatfa.jpg',
        },
        // เพิ่มได้อีก
    ]
};

function MainCommunityProducts() {
    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: '#f0f8e0', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={3} sx={{ textAlign: 'center' }}>
                ผลิตภัณฑ์ชุมชน
            </Typography>
            {Object.entries(attractionsData).map(([district, attractions]) => (
                <Box key={district} sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        ผลิตภัณฑ์ชุมชนใน {district}
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            justifyContent: {
                                xs: 'center', // มือถือ: ตรงกลาง
                                sm: 'flex-start', // จอใหญ่ขึ้น: ชิดซ้าย
                            },
                        }}>
                        {attractions.map((place, index) => (
                            <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        height: '100%',
                                        width: '300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={place.image}
                                        alt={place.name}
                                        sx={{
                                            height: { xs: 180, sm: 200, md: 220 },
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            {place.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {place.description.length > 100
                                                ? place.description.slice(0, 100) + '...'
                                                : place.description}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Chip label="สถานที่ท่องเที่ยว" size="small" color="secondary" />
                                            <Chip label={district} size="small" variant="outlined" />
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ p: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            fullWidth
                                            sx={{ backgroundColor: '#66bb6a', ':hover': { backgroundColor: '#4caf50' } }}
                                        >
                                            อ่านเพิ่มเติม
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </Box>
    )
}

export default MainCommunityProducts