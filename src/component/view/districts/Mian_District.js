import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography, Link, Stack, Avatar, createTheme, ThemeProvider, CardActions, CardContent, Card, CardMedia } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import MainVDO from '../../middles/MainVDO';
import { useMemo } from 'react';


function Mian_District({ screenWidth, defaultTheme, id, did, data }) {
    const { t, i18n } = useTranslation();
    const districts = t('districts', { returnObjects: true });
    const head_tourist_routes = t('head_tourist_routes', { returnObjects: true });
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_URL = "http://localhost:8080";
    const menuItems = useMemo(() => MainVDO(did), [did]);

    console.log("id", id);
    console.log("did", did);





    // หาข้อมูลตาม id
    const selectedDistrict = districts.find((item) => item.id === id);
    const language = i18n.language === 'th' ? selectedDistrict?.name_th : selectedDistrict?.name_en;
    // console.log("id", id);
    // console.log("selectedDistrict", selectedDistrict);
    const loadRoute = async () => {
        setLoading(true);
        setError(null); // ✅ Reset error state
        try {
            const { data } = await axios.post(`${BASE_URL}/travel_guest`, { did });
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
        const fetchData = async () => {
            if (did) {
                console.log("if");
                await loadRoute();
            } else {
                console.log("else");
                setLoading(false);
                setRoutes([]);
            }
        };

        fetchData(); // เรียกใช้ async function ที่เราสร้างไว้
    }, [did]); // ✅ ใส่ did ใน dependency array ให้ถูก


    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh', // ✅ พื้นหลังเต็มหน้าจออย่างน้อย
                    position: 'relative',
                    backgroundImage: `url('/img-web/ในเมือง_.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    },
                }}
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        pt: '20px',
                        textAlign: 'center',
                        color: '#ffffff',
                        maxWidth: {
                            xs: '95%',  // 90% บนมือถือ
                            // sm: '80%',  // 80% บนแท็บเล็ต
                            // md: '80%',  // 60% บนเดสก์ท็อป
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
                            width: '100%',
                            mx: 'auto',
                            p: 2, // padding น้อยลงสำหรับมือถือ
                            borderRadius: 2,
                        }}
                    >
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center"
                        >
                            {menuItems?.map((item, index) => (
                                <Grid
                                    item
                                    key={index}
                                    xs={12}  // เต็มหน้าจอในมือถือ
                                    sm={6}   // แบ่งครึ่งหน้าจอบนแท็บเล็ต
                                    md={4}   // 3 คอลัมน์ใน desktop
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            width: {
                                                xs: '100%', // เต็มความกว้างบนมือถือ
                                                sm: '100%',
                                                md: '100%', // คงที่เฉพาะบน desktop
                                            },
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            transition: '0.3s',
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: 'scale(1.02)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                paddingTop: '56.25%', // 16:9 aspect ratio
                                            }}
                                        >
                                            <Box
                                                component="video"
                                                src={item.videoSrc}
                                                controls
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    zIndex: 1100,
                                                }}
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
                {/* ROUTE LIST */}
                <Box
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        pt: '20px',
                        textAlign: 'center',
                        color: '#ffffff',
                        maxWidth: {
                            xs: '80%',  // 90% บนมือถือ
                        },
                        mx: 'auto', // center horizontally
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
                    ) : routes?.length > 0 ? (
                        <Grid
                            container
                            spacing={{ xs: 2 }}
                            justifyContent="center"
                        >
                            {routes?.map((route, index) => (
                                <Grid
                                    item
                                    key={route.tid}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'stretch', // ทำให้ card สูงเท่ากัน ถ้าใส่ content เพิ่มเติม
                                    }}
                                >
                                    <Card
                                        component={RouterLink}
                                        // to={`/district/${id}/${route.tid}`}
                                        to={`/district/${id}/${route.tid}?index=${index}`}
                                        sx={{
                                            zIndex: 10,
                                            borderRadius: 7,
                                            // width: '100%',
                                            // maxWidth: '250px',
                                            // height: '100%', // ยืดความสูงเต็ม grid item ถ้าต้องการ
                                            // maxHeight: '300px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            flexDirection: 'column', // ให้ CardMedia กับ Typography เรียงกัน
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
                                                // width: '300px',       // กว้างเต็มจอ
                                                height: '300px',      // สูงเต็มจอ
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
                        <Box
                            sx={{
                                background: 'white',
                                p: 2,
                                borderRadius: 2,
                                textAlign: 'center',
                                mx: 'auto',
                                my: 3,
                                maxWidth: 400,
                            }}
                        >
                            <Typography variant="body1"
                                sx={{
                                    color: 'green',
                                    fontWeight: 'bold', // หรือใช้ 700 ก็ได 
                                }}>
                                ไม่พบข้อมูลเส้นทางท่องเที่ยวในขณะนี้
                            </Typography>
                        </Box>

                    )}
                </Box>
            </Box>
        </ThemeProvider >
    )
}

export default Mian_District