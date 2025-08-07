import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography, Link, Stack, Avatar, createTheme, ThemeProvider, CardActions, CardContent, Card, CardMedia } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function Mian_District({ screenWidth, defaultTheme, id, did, data }) {
    const { t, i18n } = useTranslation();
    const districts = t('districts', { returnObjects: true });
    const head_tourist_routes = t('head_tourist_routes', { returnObjects: true });
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_URL = "http://localhost:8080";

    // หาข้อมูลตาม id
    const selectedDistrict = districts.find((item) => item.id === id);
    const language = i18n.language === 'th' ? selectedDistrict?.name_th : selectedDistrict?.name_en;

    const loadRoute = async () => {
        setLoading(true);
        setError(null); // ✅ Reset error state
        try {
            const { data } = await axios.post("http://localhost:8080/travel_guest", { did });
            console.log("✅ ดึงข้อมูลเส้นทางสำเร็จ:", data);
            setRoutes(data || []);
        } catch (error) {
            console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
            setError("ไม่สามารถโหลดข้อมูลได้ในขณะนี้ โปรดลองใหม่อีกครั้ง"); // ✅ Set user-friendly error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ✅ เพิ่ม dependency array เป็น [did] เพื่อให้ fetch ข้อมูลใหม่เมื่อ did เปลี่ยน
        if (did) {
            loadRoute();
        } else {
            // ✅ Handle case where did is not available
            setLoading(false);
            setRoutes([]);
        }
    }, [did]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid item xs={24}>
                <Box
                    sx={{
                        minHeight: '100vh', // ✅ ป้องกันกระพริบตอนโหลด
                        position: 'relative',
                        width: '100%',
                        backgroundImage: `url('/img-web/ในเมือง_.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%', // ✅ เพิ่มความสูงให้ ::after
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Box
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            pt: '20px',
                            textAlign: 'center',
                            color: '#ffffff',
                            zIndex: -1, // ให้แน่ใจว่าอยู่ด้านบนของ ::after
                            maxWidth: {
                                xs: '90%',  // 90% บนมือถือ
                                sm: '80%',  // 80% บนแท็บเล็ต
                                md: '80%',  // 60% บนเดสก์ท็อป
                            },
                            mx: 'auto', // center horizontally
                        }}
                    >
                        < Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: {
                                    xs: '1.8rem', // มือถือ
                                    sm: '2.5rem',
                                    md: '3rem',
                                },
                                color: '#ffffff',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                            }}
                        >
                            {head_tourist_routes}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                mt: 1,
                                fontSize: {
                                    xs: '1.2rem',
                                    sm: '1.8rem',
                                    md: '2rem',
                                },
                                color: '#ffffff',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                            }}
                        >
                            {language}
                        </Typography>
                        {/* VDO */}
                        <Box
                            sx={{
                                maxWidth: { xs: '95%', sm: '80%' },
                                mx: 'auto',
                                p: 4,
                                borderRadius: 2,

                            }}>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                                {/* {menuItems.map((item, index) => (
                                    <Grid
                                        item
                                        key={index}
                                        xs={12}     // 1 แถวในมือถือ (เต็มหน้าจอ)
                                        sm={6}      // 2 แถวในแท็บเล็ต
                                        md={4}      // 3 แถวในเดสก์ท็อป (12 / 4 = 3)
                                        sx={{
                                            justifyContent: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            zIndex: 1,
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                borderRadius: 7,
                                                maxWidth: '300px',
                                                width: '100%',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    transform: 'scale(1.03)',
                                                    // backgroundColor: '#006400',

                                                },
                                            }}
                                        >
                                            <Box
                                                component="video"
                                                src={item.videoSrc} // เช่น "/videos/myvideo.mp4"
                                                controls
                                                muted
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    // objectFit: 'cover',
                                                }}
                                            />
                                        </Card>
                                    </Grid>
                                ))} */}
                            </Grid>
                        </Box>
                        {/* ROUTE LIST */}
                        <Box
                            sx={{
                                maxWidth: { xs: '95%', sm: '80%' },
                                mx: 'auto',
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            {loading ? (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    กำลังโหลดข้อมูล...
                                </Typography>
                            ) : error ? (
                                <Typography variant="body1" sx={{ color: 'red' }}>
                                    {error}
                                </Typography>
                            ) : routes.length > 0 ? (
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    {routes.map((route) => (
                                        <Grid
                                            item
                                            key={route.tid}
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Card
                                                component={RouterLink}
                                                to={`/district/mueang/${route.tid}`}
                                                sx={{
                                                    zIndex: 1,
                                                    borderRadius: 7,
                                                    maxWidth: 300,
                                                    width: '100%',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden',
                                                    textDecoration: 'none', // ✅ ลบเส้นใต้ link
                                                    '&:hover': {
                                                        boxShadow: 6,
                                                        transform: 'scale(1.03)',
                                                    },
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    src={`${BASE_URL}/${route.ImageRoute?.[0]?.path || '/placeholder.jpg'}`}
                                                    alt={route.name}
                                                    // loading="lazy"
                                                    sx={{
                                                        width: '100%',
                                                        height: 220,
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        // transition: 'opacity 0.3s ease-in-out', // จาง
                                                        backgroundColor: '#f0f0f0',
                                                    }}
                                                />
                                                <CardActions sx={{ justifyContent: 'center' }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '1rem',
                                                            color: 'black',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {route.name}
                                                    </Typography>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    ไม่พบข้อมูลเส้นทางท่องเที่ยวในขณะนี้
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </ThemeProvider>
    )
}

export default Mian_District