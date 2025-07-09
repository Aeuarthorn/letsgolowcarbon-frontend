import { Avatar, Box, Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import { createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import FestivalIcon from '@mui/icons-material/Festival';

const defaultTheme = createTheme({
    typography: {
        fontFamily: "'Noto Sans Thai', 'Prompt', sans-serif",
        fontSize: 16,
    },
    palette: {
        primary: {
            main: '#007FFF',
            dark: '#0066CC',
        },
    },
});

const icon = [
    { icon: "maptravel-Photoroom.png", label: 'สถานที่ท่องเที่ยว' },
    { icon: "home-Photoroom.png", label: 'ที่พัก' },
    { icon: "food-Photoroom.png", label: 'ร้านอาหาร' },
    { icon: "gift-Photoroom.png", label: 'ร้านของที่ระลึก' },
    { icon: "market-Photoroom.png", label: 'ผลิตภัณฑ์ชุมชน' },
];

function MainRouteTraval() {
    return (
        <ThemeProvider
            theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    borderRadius: 2,
                    color: 'black',
                    px: { xs: 2, sm: 4 },
                    py: { xs: 3, sm: 5 },
                }}

            >
                <Grid
                    container
                    spacing={3}
                    sx={{
                        flex: { xs: '0 0 auto', sm: '1 1 30%' },
                        minWidth: { xs: 180, sm: 'auto' },
                        display: 'flex',
                        pb: 2,
                        justifyContent: 'center',
                    }}
                >
                    {icon.map((item, index) => (
                        <Grid
                            item
                            key={index}
                            sx={{
                                minWidth: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // ✅ จัดให้ทุกอย่างอยู่ตรงกลางแนวขวาง
                                textAlign: 'center',  // ✅ จัดข้อความให้อยู่กลาง
                            }}
                        >
                            <Box
                                component={Link}
                                to={`/${item.label}`} // ใช้ชื่อ label เป็น path เช่น /อาหาร
                                sx={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 2,
                                    borderRadius: 4,
                                    color: "white",
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#006400', // เขียวเข้ม
                                        // backgroundColor: '#e0f7fa',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                        transform: 'scale(1.05)',
                                        color: "white",
                                    },
                                }}
                            >
                                <img
                                    src={`/${item.icon}`}
                                    style={{
                                        width: '150px',
                                        filter: 'brightness(0) invert(1)',
                                        '&:hover': {
                                            filter: 'brightness(0) saturate(100%) sepia(100%) hue-rotate(75deg) brightness(1.2)',
                                        },
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.8rem', sm: '1rem' },
                                        mt: 1.5,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ThemeProvider>

    )
}

export default MainRouteTraval