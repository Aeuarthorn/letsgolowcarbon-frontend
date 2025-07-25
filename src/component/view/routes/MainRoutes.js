import React, { useState, useMemo } from 'react'
import { Link, Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Card, Stack, Button, Avatar, Grid, Table, ToggleButton, ToggleButtonGroup, TableHead, TableRow, TableCell, TableBody, CardContent, Divider } from '@mui/material';
import { AccessTime, WbSunny, DarkMode, Person } from '@mui/icons-material';
import { fuelData } from '../data/Data';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMapEvents,
} from "react-leaflet";
import { getDistance } from "geolib";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import { createNumberedIcon, LocationMarker, LocationMarkerView } from '../../middles/Map';
import { fuelDataTable, vehicleTypes } from '../../middles/MockData';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MainRoutes() {
    const { slug, id } = useParams();
    const { t } = useTranslation();
    const [points, setPoints] = useState([]);
    const [routePolyline, setRoutePolyline] = useState([]);


    const routeKey = `route_${slug}`;
    const allRoutes = t(routeKey, { returnObjects: true });

    const selectedRoute = Array.isArray(allRoutes)
        ? allRoutes.find((r) => String(r.id) === id)
        : null;

    const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes.find(v => v.type === 'car'));

    const distance = selectedRoute.distance || 0;

    const { fuelUsed, carbonFootprint } = useMemo(() => {
        if (!selectedVehicle || !selectedVehicle.efficiency || !selectedVehicle.co2PerLiter) return {
            fuelUsed: 0,
            carbonFootprint: 0,
        };

        const fuel = distance / selectedVehicle.efficiency;
        const carbon = fuel * selectedVehicle.co2PerLiter;

        return {
            fuelUsed: fuel,
            carbonFootprint: carbon,
        };
    }, [selectedVehicle, distance]);

    console.log(" distance:", distance);
    console.log("selected vehicle:", selectedVehicle);
    console.log("fuel used:", fuelUsed);
    console.log("carbon footprint:", carbonFootprint);



    if (!selectedRoute) {
        return (
            <Container maxWidth="sm" sx={{ pt: 4 }}>
                <Typography variant="h6" color="error">ไม่พบข้อมูลเส้นทางที่คุณเลือก</Typography>
            </Container>
        );
    }

    const handleRemovePoint = (index) => {
        const newPoints = [...points];
        newPoints.splice(index, 1);
        setPoints(newPoints);
        setRoutePolyline([]); // reset route
    };

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
        <Container maxWidth={false} sx={{ pt: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center' }} gutterBottom>
                {selectedRoute.name}
            </Typography>

            <Grid container spacing={3}>
                {/* Left Side: Map */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            height: '100%',
                            maxHeight: '700px',
                            width: "100%",
                            borderRadius: 2,
                            alignContent: 'center',
                            overflow: 'hidden',
                            boxShadow: 2,
                            backgroundColor: '#4d7e39ff',
                            padding: 3,
                        }}
                    >
                        <Box
                            sx={{
                                height: { xs: 250, md: 500 },
                                width: "100%",
                                // borderRadius: 2,
                                alignContent: 'center',
                                margin: '0 auto',
                                overflow: 'hidden',
                                // boxShadow: 2,
                            }}
                        >
                            <MapContainer
                                center={[13.736717, 100.523186]}
                                zoom={6}
                                style={{ height: "100%", maxHeight: "500px", width: "100%", borderRadius: 10 }}
                                // dragging={false}
                                // scrollWheelZoom={false}
                                // doubleClickZoom={false}
                                touchZoom={false}
                            // boxZoom={false}
                            // keyboard={false}
                            // zoomControl={false} // ถ้าไม่ต้องการปุ่มซูมที่มุมขวา
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                />

                                {/* <LocationMarkerView onAddPoint={""} /> */}

                                {/* {points?.map((pos, idx) => {
                                    const isMiddlePoint = idx > 0 && idx < points.length - 1;
                                    const numberedIcon = createNumberedIcon(idx + 1, isMiddlePoint);

                                    return (
                                        <Marker key={idx} position={pos} icon={numberedIcon}>
                                            <Popup>
                                                จุดที่ {idx + 1}
                                                <br />
                                                Lat: {pos.lat.toFixed(6)} <br />
                                                Lng: {pos.lng.toFixed(6)} <br />
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemovePoint(idx)}
                                                >
                                                    ลบจุดนี้
                                                </Button>
                                            </Popup>
                                        </Marker>
                                    );
                                })} */}


                                {/* เส้นทางจริงตามถนน */}
                                {routePolyline.length > 0 && (
                                    <Polyline
                                        positions={routePolyline}
                                        pathOptions={{ color: "blue", weight: 4 }}
                                    />
                                )}
                            </MapContainer>
                        </Box>
                        {/* <Typography mt={2} fontWeight="bold" sx={{ color: 'white' }}>
                            ระยะเส้นทาง : {selectedRoute.distance || '8.12'} กิโลเมตร
                        </Typography> */}
                        {/* Vehicle selector */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <ToggleButtonGroup
                                exclusive
                                value={selectedVehicle?.type}
                                onChange={(e, value) => {
                                    if (!value) return;
                                    const found = vehicleTypes.find(v => v.type === value);
                                    if (found) setSelectedVehicle(found);
                                }}
                                aria-label="Vehicle Selection"
                            >
                                {vehicleTypes?.map((vehicle) => (
                                    <ToggleButton
                                        key={vehicle.type}
                                        value={vehicle.type}
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1,
                                            '&.Mui-selected': {
                                                backgroundColor: '#81c784',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        {vehicle.icon}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>

                        {/* Footer info */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                                px: 1,
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        >
                            <Typography>ระยะเส้นทาง : {distance.toFixed(2)} กิโลเมตร</Typography>
                            <Typography>Carbon Footprint : {carbonFootprint.toFixed(2)} kg CO2e.</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Route Details */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            {/* หัวข้อ */}
                            <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                                {selectedRoute.name || '1 วัน'}
                            </Typography>

                            {/* เช้า */}
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                <AccessTime sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">เช้า</Typography>
                                    <Typography variant="body2">
                                        - ทำกิจกรรมที่ Columbo Craft Village หมู่บ้านบางคาร์ฟ...
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* กลางวัน */}
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                <WbSunny sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">กลางวัน</Typography>
                                    <Typography variant="body2">
                                        - ร้านแค่น (KAEN) ร้านอาหารสไตล์ Casual Fine Dining...
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* เย็น */}
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                                <DarkMode sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">เย็น</Typography>
                                    <Typography variant="body2">
                                        - นั่งชิลๆ โดยในช่วงเย็นจะเห็นภาพนักศึกษา...
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Footer */}
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" mt={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person fontSize="small" />
                                    <Typography variant="caption">Mr.Auearthorn</Typography>
                                </Stack>
                                <Typography variant="caption">1 ปีที่แล้ว</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Fuel Table */}
                <Grid item xs={12} md={12}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        คำนวณน้ำมันและคาร์บอน
                    </Typography>
                    <Typography variant="h9" gutterBottom>
                        *ราคาน้ำมันวันที่ 10 ตุลาคม 2567
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            display: 'flex',              // ✅ จัด layout แบบ flex
                            justifyContent: 'center',     // ✅ จัดแนวนอนให้ตรงกลาง
                            alignItems: 'center',         // ถ้าต้องการแนวตั้ง (ไม่จำเป็นในกรณีนี้)
                            textAlign: 'center',
                            mt: 2,
                        }}
                    >
                        <Table
                            size="small"
                            sx={{
                                borderCollapse: "collapse",
                                width: "100%",
                                border: "1px solid #ccc",

                            }}
                        >
                            <TableHead>
                                <TableRow >
                                    {[
                                        "เส้นทาง",
                                        "ระยะทาง (กม.)",
                                        "พาหนะ",
                                        "น้ำมัน",
                                        "ราคาต่อลิตร",
                                        "ปริมาณที่ใช้",
                                        "คาร์บอน",
                                        "จำนวน (บาท)",
                                    ].map((head, idx) => (
                                        <TableCell
                                            key={idx}
                                            align="center"
                                            sx={{
                                                border: "1px solid #ccc",
                                                fontWeight: "bold",
                                                backgroundColor: "#f9f9f9",
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fuelDataTable?.map((route, routeIdx) => {
                                    const vehicleRows = route?.vehicles?.flatMap(v => v?.fuels).length;
                                    let vehicleRowCounter = 0;

                                    return route?.vehicles?.map((vehicle, vehicleIdx) =>
                                        vehicle?.fuels?.map((fuel, fuelIdx) => {
                                            const isFirstVehicleRow = fuelIdx === 0;
                                            const isFirstRouteRow = vehicleRowCounter === 0;

                                            vehicleRowCounter++;

                                            return (
                                                <TableRow key={`${routeIdx}-${vehicleIdx}-${fuelIdx}`} sx={{ fontSize: '0.75rem' }}>
                                                    {isFirstRouteRow && (
                                                        <>
                                                            <TableCell rowSpan={vehicleRows} sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                                {route.route}
                                                            </TableCell>
                                                            <TableCell rowSpan={vehicleRows} align="center" sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                                {route.distance}
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    {isFirstVehicleRow && (
                                                        <TableCell
                                                            rowSpan={vehicle?.fuels?.length}
                                                            sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}
                                                        >
                                                            {vehicle?.type}
                                                        </TableCell>
                                                    )}

                                                    <TableCell sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>{fuel?.name}</TableCell>
                                                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                        {fuel?.price.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                        {fuel?.use.toFixed(2)} L
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                        {fuel?.co2.toFixed(2)} kg CO2e
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontSize: '0.75rem' }}>
                                                        {(fuel?.price * fuel?.use).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
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

        </Container >
    );
}

export default MainRoutes;
