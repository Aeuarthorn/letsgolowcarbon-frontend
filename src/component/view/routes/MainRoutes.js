import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Stack,
    Divider,
    CardMedia,
} from '@mui/material';
import {
    GoogleMap,
    LoadScript,
    Marker,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";
import MainRouteFooter from './MainRouteFooter';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { AccessTime, DarkMode, Person, WbSunny } from '@mui/icons-material';
import { MapContainer, TileLayer } from 'react-leaflet';
import TravelPlanner from './TravelPlanner';
import axios from 'axios';
import { useCallback } from 'react';

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 16.47, lng: 102.81 }; // ขอนแก่น
// 16.432949297459142, 102.82441869458061 ขอนแก่น
const translations = {
    vechicle_1: 'รถจักรยานยนต์',
    vechicle_2: 'รถยนต์',
    vechicle_3: 'รถตู้',
    distance_title: 'ระยะทางรวม',
    carbon_footprint: 'Carbon Footprint',
    km: 'กม.',
    loading_route: 'ข้อมูลการเดินทาง',
};

function MainRoutes() {
    const BASE_URL = "http://localhost:8080";
    const { slug, id } = useParams();
    const { t } = useTranslation();
    const [points, setPoints] = useState([]);
    const [vihicleWithRoute, setVihicleWithRoute] = useState([]);
    const [reduceDsitance, setReduceDsitance] = useState(0);
    const [selectedVehicle, setSelectedVehicle] = useState('motorcycle');
    const [selectedRoutes, setselectedRoutes] = useState('motorcycle');
    const [loading, setLoading] = useState(false);
    const [totalCO2E, setTotalCO2E] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [images, setImages] = useState([]); // รูปภาพ

    const [routePath, setRoutePath] = useState([]); // เก็บเส้นทางที่ได้จาก Directions API
    const mapRef = useRef(null);
    const routeKey = `route_${slug}`;
    const allRoutes = t(routeKey, { returnObjects: true });

    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });
    const selectedRoute = Array.isArray(allRoutes)
        ? allRoutes.find((r) => String(r.id) === id)
        : null;



    function calculateCO2E(vechicleType, fuelType, distance) {
        // วิธีหาน้ำมันที่ใช้
        // ระยะทาง ÷ 40(มอไซค์)/15(รถยนต์)/10(รถตู้) จากนั้น x ด้วย 1000(จำนวนมิลลิลิตร​) = จะได้ปริมาณน้ำมันที่ใช้ในการเดินทาง มีหน่วยเป็นมิลลิลิตร
        // const oilUsed = ((distance / fixedVechicleTypeValue) * 1000);
        var findFuelUsed = calculateOilUsage(distance, vechicleType);
        var co2ePerLiter = getCO2ePerLiter(fuelType);
        console.log("co2ePerLiter", co2ePerLiter);
        console.log("findFuelUsed", findFuelUsed);
        var co2e = (findFuelUsed * co2ePerLiter)
        var cal = co2e / 1000; // คำนวณ CO2e (kg)
        var cal = Math.floor(cal * 100) / 100;
        console.log("cal", cal);
        return cal.toFixed(2);
        // return co2e; // คืนค่าเป็น float (ไม่ปัดเศษ)
    }
    function calculateOilUsage(distance, vechicleType) {
        // - วิธีหาน้ำมันที่ใช้ -
        //     ระยะทาง ÷ 40(มอไซค์) / 15(รถยนต์) / 10(รถตู้) จากนั้น x ด้วย 1000(จำนวนมิลลิลิตร) = จะได้ปริมาณน้ำมันที่ใช้ในการเดินทาง มีหน่วยเป็นมิลลิลิตร
        let efficiencyKmPerL;
        if (vechicleType === "motorcycle") {
            efficiencyKmPerL = 40;
        } else if (vechicleType === "car") {
            efficiencyKmPerL = 15;
        } else if (vechicleType === "van") {
            efficiencyKmPerL = 10;
        } else {
            efficiencyKmPerL = 1; // fallback กันหารศูนย์
        }
        console.log("efficiencyKmPerL", efficiencyKmPerL);
        console.log("(distance / efficiencyKmPerL) * 1000", (distance / efficiencyKmPerL) * 1000);

        return (distance / efficiencyKmPerL) * 1000; // mL
    }
    function getCO2ePerLiter(fuelType) {
        // สามารถใช้เงื่อนไขเพื่อตรวจสอบประเภทของน้ำมันหรือเชื้อเพลิงและคืนค่าที่เหมาะสม
        if (fuelType === 'Gasoline') {
            return 2.2719; // ปริมาณ CO2e ที่เกิดขึ้นต่อลิตรสำหรับเบนซิน  2.2719(ในกรณีที่ใช้น้ำมันแก๊ส​โซฮอล์​ เช่น มอไซค์,รถยนต์) / 2
        } else if (fuelType === 'Diesel') {
            return 2.7406; // ปริมาณ CO2e ที่เกิดขึ้นต่อลิตรสำหรับดีเซล 2.7406(ในกรณีที่ใช้น้ำมันดีเซล เช่น รถตู้) 
        } else {
            return 1; // หากไม่รู้จักประเภทน้ำมันหรือเชื้อเพลิงอื่น ๆ คืนค่า 0
        }
    }

    // โหลดข้อมูลเส้นทางรถ (โหลดรอบเดียวตอน mount หรือเมื่อ id, token เปลี่ยน)
    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            axios.post("http://localhost:8080/vehicle_with_routes_guest", { tid: parseInt(id) }),
            axios.post("http://localhost:8080/travel_route_guest", { tid: parseInt(id) }),
            axios.post("http://localhost:8080/travel_route_details_guest", { tid: parseInt(id) }),
        ])
            .then(([vehicleRes, routeRes, routeDetails]) => {
                console.log("routeDetails?.data ", routeDetails?.data);
                // console.log("vehicleRes?.data ", vehicleRes?.data);
                // console.log("routeRes.data ", routeRes.data);
                setVihicleWithRoute(vehicleRes?.data || []);
                setImages(routeDetails?.data?.ImageRoute || []);
                setselectedRoutes(routeDetails?.data || []);
                const fixedPoints = routeRes?.data
                    ?.map((p) => {
                        const lat = parseFloat(p.lat);
                        const lng = parseFloat(p.lng);

                        if (isNaN(lat) || isNaN(lng)) {
                            console.warn("❌ พิกัดไม่ถูกต้อง ถูกละไว้:", p);
                            return null;
                        }

                        return {
                            lat,
                            lng,
                            name: p.name || "", // fallback ถ้า name หาย
                        };
                    })
                    .filter((p) => p !== null); // ลบจุดที่ไม่ valid ออก

                if (isLoaded && fixedPoints.length > 0) {

                    fetchRoute(fixedPoints);
                    setMapReady(true);
                } else {
                    console.warn("⚠️ ไม่มีจุดที่ valid สำหรับแสดงบนแผนที่");
                }
                // setPoints(routeRes.data || []);
                console.log("✅ โหลดทั้งสองข้อมูลสำเร็จ");
            })
            .catch((err) => {
                console.error("❌ โหลดข้อมูลล้มเหลว:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, isLoaded]);

    // คำนวณ CO2 และระยะทางรวม — ทำเมื่อเลือก Vehicle หรือข้อมูลถูกโหลดเสร็จ
    useEffect(() => {
        if (vihicleWithRoute && selectedVehicle) {
            setLoading(true);
            const distanceSum = vihicleWithRoute.reduce((acc, curr) => acc + curr.distance, 0);
            setReduceDsitance(distanceSum);

            const fuelType = (selectedVehicle === "motorcycle" || selectedVehicle === "car") ? 'Gasoline' : 'Diesel';
            const co2e = calculateCO2E(selectedVehicle, fuelType, distanceSum);
            setTotalCO2E(co2e);
            setLoading(false);
        }

    }, [selectedVehicle, vihicleWithRoute]);

    // const loadVihicleWithRoute = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post("http://localhost:8080/vehicle_with_routes_guest", {
    //             tid: parseInt(id)
    //         });

    //         console.log("✅ ดึงข้อมูลสำเร็จ:", response.data);
    //         setVihicleWithRoute(response.data || []);
    //     } catch (error) {
    //         console.error("❌ ดึงข้อมูลล้มเหลว:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [id, token]);

    // const loadTravelRoute = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post("http://localhost:8080/travel_route_guest", {
    //             tid: parseInt(id)
    //         });

    //         console.log("✅ ดึงข้อมูล Map สำเร็จ:", response.data);
    //         setPoints(response.data || []);
    //     } catch (error) {
    //         console.error("❌ ดึงข้อมูลล้มเหลว:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [id, token]);



    const handleVehicleChange = (event, newVehicle) => {
        console.log("newVehicle", newVehicle);

        if (newVehicle !== null) {
            setSelectedVehicle(newVehicle);
        }
    };

    // ฟังก์ชันเรียก Directions API และตั้งค่าเส้นทาง
    const fetchRoute = async (points) => {
        if (points.length < 2) {
            setRoutePath([]);
            return;
        }

        // const directionsService = new window.google.maps.DirectionsService();
        const directionsService = new window.google.maps.DirectionsService();


        const origin = points[0];
        const destination = points[points.length - 1];
        const waypoints = points.slice(1, points.length - 1).map((p) => ({
            location: { lat: p.lat, lng: p.lng },
            stopover: true,
        }));

        directionsService?.route(
            {
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING, // หรือ WALKING, BICYCLING ตามต้องการ
                optimizeWaypoints: true, // เพื่อให้ Google หาทางที่ใกล้ที่สุด
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    const path = [];

                    // ดึง path ทุกจุดจาก legs ของ route
                    result.routes[0].legs.forEach((leg) => {
                        leg.steps.forEach((step) => {
                            step.path.forEach((latlng) => {
                                path.push({ lat: latlng.lat(), lng: latlng.lng() });
                            });
                        });
                    });

                    setRoutePath(path);
                    setPoints(points);
                } else {
                    console.error("Directions request failed due to " + status);
                    setRoutePath([]);
                }
            }
        );
    };


    if (!selectedRoute) {
        return (
            <Container maxWidth="sm" sx={{ pt: 4 }}>
                <Typography variant="h6" color="error">ไม่พบข้อมูลเส้นทางที่คุณเลือก</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ pt: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center' }} gutterBottom>
                {selectedRoute.name}
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 1 }}>
                {/* Map and Controls Section */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3, padding: 2 }}>
                        <Box
                            sx={{
                                height: { xs: 250, md: 500 },
                                width: "100%",
                                alignContent: "center",
                                margin: "0 auto",
                                overflow: "hidden",
                            }}
                        >
                            {(isLoaded && mapReady) ? (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={points[0] || defaultCenter} // มั่นใจว่ามีค่า
                                    zoom={13}
                                    onLoad={(map) => {
                                        mapRef.current = map;

                                        if (points.length === 0) return;

                                        const bounds = new window.google.maps.LatLngBounds();
                                        const pathPoints = routePath?.length > 0 ? routePath : points;

                                        pathPoints.forEach((p) => {
                                            if (typeof p.lat === "number" && typeof p.lng === "number") {
                                                bounds.extend(new window.google.maps.LatLng(p.lat, p.lng));
                                            }
                                        });

                                        map.fitBounds(bounds);
                                    }}
                                >
                                    {/* MARKERS */}
                                    {points.map((p, idx) => (
                                        <Marker
                                            key={idx}
                                            position={{ lat: p.lat, lng: p.lng }}
                                            label={`${idx + 1}`}
                                            title={p.name}
                                        />
                                    ))}

                                    {/* POLYLINE */}
                                    {routePath?.length > 0 && (
                                        <Polyline
                                            path={routePath}
                                            options={{
                                                strokeColor: "#2e7d32",
                                                strokeOpacity: 0.9,
                                                strokeWeight: 5,
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <ToggleButtonGroup
                                value={selectedVehicle}
                                exclusive
                                onChange={handleVehicleChange}
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        borderRadius: 4,
                                        p: 1,
                                        border: 'none',
                                        backgroundColor: 'grey.200',
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'grey.300',
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="motorcycle" aria-label={translations.vechicle_1}>
                                    <TwoWheelerIcon />
                                </ToggleButton>
                                <ToggleButton value="car" aria-label={translations.vechicle_2}>
                                    <DirectionsCarIcon />
                                </ToggleButton>
                                <ToggleButton value="van" aria-label={translations.vechicle_3}>
                                    <DirectionsBusIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {translations.distance_title}:
                                </Typography>
                                {loading ? (
                                    <CircularProgress size={20} sx={{ ml: 1 }} />
                                ) : (
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1 }}>
                                        {reduceDsitance.toFixed(2)}
                                    </Typography>
                                )}
                                <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1 }}>
                                    {translations.km}
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                {translations.carbon_footprint}: {totalCO2E} kg CO2e
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* รายละเอียดเส้นทาง */}
                <Grid item xs={12} lg={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                                {selectedRoutes?.title || '1 วัน'}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                <AccessTime sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">เช้า</Typography>
                                    <Typography variant="body2">
                                        - {selectedRoutes?.morningDetails}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                <WbSunny sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">กลางวัน</Typography>
                                    <Typography variant="body2">
                                        - {selectedRoutes?.middayDetails}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                <WbSunny sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">บ่าย</Typography>
                                    <Typography variant="body2">
                                        - {selectedRoutes?.eveningDetails}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                                <DarkMode sx={{ mt: '4px' }} />
                                <Box>
                                    <Typography fontWeight="bold">เย็น</Typography>
                                    <Typography variant="body2">
                                        - {selectedRoutes?.afternoonDetails}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" mt={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person fontSize="small" />
                                    <Typography variant="caption">Mr.{selectedRoutes?.User?.name}</Typography>
                                </Stack>
                                <Typography variant="caption">1 ปีที่แล้ว</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Details Table Section */}

                {/* table vihicle */}
                <TravelPlanner data={vihicleWithRoute} />

                {/* แสดง preview info_route */}
                <Grid item xs={12}>

                    <CardMedia
                        component="img"
                        src={`${BASE_URL}/${images[0]?.path || '/placeholder.jpg'}`}
                        alt={images[0]?.filename}
                        // loading="lazy"
                        sx={{
                            width: '100%',
                            // height: 220,
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: 12,
                            // transition: 'opacity 0.3s ease-in-out', // จาง
                            backgroundColor: '#f0f0f0',
                        }}
                    />
                </Grid>

                {/* footer */}
                <MainRouteFooter />
            </Grid>
        </Container>
    );
}

export default MainRoutes;
