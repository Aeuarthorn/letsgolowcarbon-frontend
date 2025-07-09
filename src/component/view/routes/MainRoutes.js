import React, { useState } from 'react'
import { Link, Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Stack, Avatar, Grid, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { fuelData } from '../data/Data';
import { ApiProvider, Map, Marker } from "@vis.gl/react-google-maps";
function MainRoutes() {
    const { slug, id } = useParams();
    const { t } = useTranslation();

    const [markerLocation, setMarkerLocation] = useState({
        lat: 51.509865,
        lng: -0.118092,
    });

    const routeKey = `route_${slug}`;
    const allRoutes = t(routeKey, { returnObjects: true });

    const selectedRoute = Array.isArray(allRoutes)
        ? allRoutes.find((r) => String(r.id) === id)
        : null;

    if (!selectedRoute) {
        return (
            <Container maxWidth="sm" sx={{ pt: 4 }}>
                <Typography variant="h6" color="error">ไม่พบข้อมูลเส้นทางที่คุณเลือก</Typography>
            </Container>
        );
    }

    const logos = [
        { src: "/img-web/logo-kku.png", link: "https://example.com/ในเมือง" },
        { src: "/img-web/logo-kkbs.png", link: "https://example.com/ภูผาม่าน" },
        { src: "/img-web/logo-captour.png", link: "https://example.com/อุบลรัตน์" },
        { src: "/img-web/logo-kkuttravel.png", link: "https://example.com/อุบลรัตน์" },
        { src: "/img-web/logo.png", link: "https://example.com/อุบลรัตน์" },
    ];
    const socialLinks = [
        { icon: "/img-web/instagram.png", },
        { icon: "/img-web/facebook.png" },
        { icon: "/img-web/line.png" },
        { icon: "/img-web/tik-tok.png" },
        { icon: "/img-web/youtube.png" },
    ];

    return (
        <Container maxWidth="md" sx={{ pt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {selectedRoute.name}
            </Typography>

            <Grid container spacing={4}>
                {/* Left Side: Map */}
                <Grid item xs={12} md={7}>
                    <Box
                        sx={{
                            height: { xs: 250, md: 400 },
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 2,
                        }}
                    >
                        <Map
                            style={{ borderRadius: "20px" }}
                            defaultZoom={13}
                            defaultCenter={markerLocation}
                            gestureHandling={"greedy"}
                            disableDefaultUI
                        >
                            <Marker position={markerLocation} />
                        </Map>
                    </Box>
                    <Typography mt={2} fontWeight="bold">
                        ระยะเส้นทาง : {selectedRoute.distance || '8.12'} กิโลเมตร
                    </Typography>
                </Grid>

                {/* Right Side: Route Details */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {selectedRoute.name}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedRoute.description || 'รายละเอียดของเส้นทางนี้ยังไม่มีการระบุ'}
                    </Typography>
                </Grid>

                {/* Fuel Table */}
                <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        คำนวณน้ำมันและคาร์บอน
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ประเภท</TableCell>
                                <TableCell>ระยะทาง (กม.)</TableCell>
                                <TableCell>การใช้น้ำมัน (ลิตร)</TableCell>
                                <TableCell>คาร์บอน (kg CO2e)</TableCell>
                                <TableCell>ค่าใช้จ่าย (บาท)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fuelData?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.distance}</TableCell>
                                    <TableCell>{item.fuelUse.toFixed(2)}</TableCell>
                                    <TableCell>{item.co2.toFixed(2)}</TableCell>
                                    <TableCell>{item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>

            {/* start Footer */}
            <Box
                sx={{
                    maxWidth: { xs: '100%', sm: 800 },
                    mx: 'auto',
                    my: 4,
                    p: 4,
                    borderRadius: 2,
                    color: 'black',
                }}
            >
                <Stack spacing={3} alignItems="center" width="100%">
                    <Box
                        display="flex"
                        justifyContent="center"
                        gap={2}
                        mt={4}
                        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}

                    >
                        {socialLinks.map((logo, i) => (
                            <a
                                key={i}
                                href={logo?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', cursor: 'pointer' }}
                            >
                                <Avatar
                                    src={logo?.icon}
                                    variant="square"
                                    sx={{
                                        width: 'auto',
                                        height: { xs: '30px', sm: '40px' },
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        p: 0.5,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',  // เอฟเฟกต์เงานูนขึ้น
                                        },
                                    }}
                                />
                            </a>
                        ))}
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="center"
                        gap={2}
                        mt={4}
                        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                    >
                        {logos.map((logo, i) => (
                            <a
                                key={i}
                                href={logo?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', cursor: 'pointer' }}
                            >
                                <Avatar
                                    src={logo?.src}
                                    variant="square"
                                    sx={{
                                        width: 'auto',
                                        height: { xs: '50px', sm: '70px' },
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        p: 0.5,
                                        bgcolor: 'transparent',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',  // เอฟเฟกต์เงานูนขึ้น
                                        },
                                    }}
                                />
                            </a>
                        ))}
                    </Box>

                    <Box textAlign="center" mt={3}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                            LET’S GO LOW CARBON BY CAPTOUR & KKU TRAVEL, KKBS, KKU © 2023
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                            mt={1}
                            alignItems="center"
                        >
                            <Link component={RouterLink} to="/privacy" underline="hover">
                                {t('menu.privacy_policy')}
                            </Link>
                            <Link component={RouterLink} to="/terms" underline="hover">
                                {t('menu.terms')}
                            </Link>
                            <Link component={RouterLink} to="/contact" underline="hover">
                                {t('menu.contacts')}
                            </Link>
                            <Link component={RouterLink} to="/about" underline="hover">
                                {t('menu.abouts')}
                            </Link>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
            {/* end Footer */}

        </Container>
    );
}

export default MainRoutes;
