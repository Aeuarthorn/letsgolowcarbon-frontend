import React, { useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
// ข้อมูลตัวอย่าง (คุณสามารถเปลี่ยนเป็น props หรือดึงจาก API)

function MainTravelTypes() {
    const token = localStorage.getItem("token")
    const BASE_URL = "http://localhost:8080";
    const [loading, setLoading] = useState(true);
    const [travelforRoutes, setTravelforRoutes] = useState([]);
    const [error, setError] = useState(null);
    const { ttid } = useParams();
    const location = useLocation();

    // ดึง name จาก query string
    const queryParams = new URLSearchParams(location.search);
    const nameFromQuery = queryParams.get('name');
    const ttids = parseInt(ttid)
    console.log("ttid", ttid);
    console.log("nameFromQuery", nameFromQuery);
    console.log("travelforRoutes", travelforRoutes);


    const loadTravelForRoute = async () => {
        setLoading(true);
        setError(null); // ✅ Reset error state
        try {
            const travelforRoutes = await axios.post(`${BASE_URL}/travel_route_ttid_guest`, { ttid: ttids });
            console.log("✅ ดึงข้อมูลเส้นทางสำเร็จ:", travelforRoutes?.data);
            setTravelforRoutes(travelforRoutes?.data || []);
        } catch (error) {
            console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
            setError("ไม่สามารถโหลดข้อมูลได้ในขณะนี้ โปรดลองใหม่อีกครั้ง"); // ✅ Set user-friendly error message
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (ttid) {
                console.log("if");
                await loadTravelForRoute();
            } else {
                console.log("else");
                setLoading(false);
                setTravelforRoutes([]);
            }
        };

        fetchData(); // เรียกใช้ async function ที่เราสร้างไว้
    }, [ttid]); // ✅ ใส่ ttid ใน dependency array ให้ถูก





    return (
        <Box
            sx={{
                minHeight: "100vh",
                p: 4,
                bgcolor: '#e8f5e9', // สีพื้นหลังเขียวอ่อน
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                color="success.main" // ใช้สีเขียวหลักจาก theme
                gutterBottom
                textAlign="center"
                sx={{ mb: 1 }}
            >
                รูปแบบการท่องเที่ยว
            </Typography>

            <Typography
                variant="h5"
                fontWeight="bold"
                color="success.dark"
                gutterBottom
                textAlign="center"
                sx={{ mb: 4 }}
            >
                {nameFromQuery}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {travelforRoutes?.length > 0 ?
                    <>

                        {travelforRoutes?.map((route) => {
                            console.log("route888888", route);
                            let id
                            if (route.did === 1) {
                                id = "mueang";
                            } else if (route.did === 2) {
                                id = "phu_pha_man";
                            } else if (route.did === 3) {
                                id = "ubonrat";
                            } else if (route.did === 4) {
                                id = "phu_wiang";
                            } else if (route.did === 5) {
                                id = "nam_phong";
                            } else if (route.did === 6) {
                                id = "si_chomphu";
                            } else {
                                console.log("ไม่มีข้อมูล ID");

                            }
                            // const locationName = didToName[route.did] || 'unknown';
                            console.log("id", id);

                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={route.tid}>
                                    <Card
                                        component={RouterLink}
                                        to={`/district/${id}/${route.tid}?name=${encodeURIComponent(route?.name)}`}
                                        // to={`/travel/${route.tid}`}
                                        sx={{
                                            borderRadius: 3,
                                            textDecoration: 'none',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 10px rgba(76,175,80,0.15)', // เงาเขียวอ่อน
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 8px 20px rgba(56,142,60,0.3)', // เงาเขียวเข้มเมื่อ hover
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={`${BASE_URL}/${route.ImageRoute[0]?.path}`}
                                            alt={route.name}
                                            sx={{ objectFit: 'cover', width: '100%' }}
                                        />
                                        <CardContent
                                            sx={{
                                                backgroundColor: '#fff',
                                                width: '100%',
                                                textAlign: 'center',
                                                py: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                color="success.dark"
                                            >
                                                {route.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </>
                    :
                    <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                        {/* <CircularProgress /> */}
                        ยังไม่มีข้อมูลรูปแบบการท่องเที่ยว ({nameFromQuery})
                    </Box>
                }
            </Grid>
        </Box>
    );
}

export default MainTravelTypes