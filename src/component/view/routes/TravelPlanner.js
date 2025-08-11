import { Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const TravelPlanner = ({ data }) => {

    // ฟังก์ชันคำนวณปริมาณน้ำมัน
    const calculateOilUsage = (distance, efficiency) => {
        if (efficiency === 0) return 0;
        return (distance / efficiency) * 1000; // in ml
    };

    // ฟังก์ชันคำนวณค่าใช้จ่าย
    const calculatePriceBath = (oilUsage, pricePerLiter) => {
        return (oilUsage / 1000) * pricePerLiter;
    };

    // ฟังก์ชันคำนวณ Carbon Footprint (ปรับปรุงให้เหมือนในภาพ)
    const calculateCO2E = (oilUsageInLiter) => {
        // สมมติว่าน้ำมัน 1 ลิตร = 2.4 kg CO2e โดยประมาณ
        const co2eFactor = 2.4;
        return (oilUsageInLiter * co2eFactor);
    };

    return (
        // ... (ส่วนบนของ component เหมือนเดิม)
        <Grid item xs={12}>
            {/* <Card sx={{ p: 2, borderRadius: 4, boxShadow: 3 }}> */}
            <Typography component="h2" align="left" gutterBottom>
                *ราคาน้ำมันวันที่ 10 ตุลาคม 2567
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, border: '1px solid', borderColor: 'grey.300' }}>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2} sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300', textAlign: 'center' }}>เส้นทาง</TableCell>
                            <TableCell rowSpan={2} sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300', textAlign: 'center' }}>ระยะทาง</TableCell>
                            <TableCell colSpan={12} sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300', textAlign: 'center' }}>คาร์บอนและค่าใช้จ่าย</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>พาหนะที่ใช้ในการเดินทาง</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>น้ำมัน</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>ราคาต่อลิตร</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>ปริมาณน้ำมันที่ใช้</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>ปริมาณคอาร์บอน</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'grey.300' }}>จำนวน (บาท)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((route, routeIndex) => {
                            // console.log("rr", route);
                            return route?.vehicles?.map((vehicle, vehicleIndex) => {
                                const vehicleRows = vehicle.fuelTypes.length;
                                const oilUsageInMl = calculateOilUsage(route.distance, vehicle.efficiency);
                                const oilUsageInLiter = oilUsageInMl / 1000;
                                // console.log("vehicleRows", vehicleRows);
                                // console.log("oilUsageInMl", oilUsageInMl);
                                // console.log("oilUsageInLiter", oilUsageInLiter);
                                // console.log("vehicle", vehicle);

                                return vehicle?.fuelTypes?.map((fuelType, fuelIndex) => {
                                    // console.log("fuelType", fuelType);
                                    return (
                                        <TableRow key={`${routeIndex}-${vehicleIndex}-${fuelIndex}`}>

                                            {/* ช่อง "เส้นทาง" */}
                                            {vehicleIndex === 0 && fuelIndex === 0 && (
                                                <TableCell
                                                    rowSpan={route?.vehicles?.reduce((sum, v) => sum + v.fuelTypes?.length, 0)}
                                                    sx={{ border: '1px solid rgba(0,0,0,0.2)' }}
                                                >
                                                    {route?.origin} - {route?.destination}
                                                </TableCell>
                                            )}

                                            {/* ช่อง "ระยะทาง" */}
                                            {fuelIndex === 0 && (
                                                <TableCell
                                                    rowSpan={vehicleRows}
                                                    sx={{ border: '1px solid rgba(0,0,0,0.2)' }}
                                                >
                                                    {route?.distance.toFixed(2)}
                                                </TableCell>
                                            )}

                                            {/* ช่อง "พาหนะ" */}
                                            {fuelIndex === 0 && (
                                                <TableCell
                                                    rowSpan={vehicleRows}
                                                    sx={{ border: '1px solid rgba(0,0,0,0.2)' }}
                                                >
                                                    {vehicle?.name}<br />({vehicle?.efficiency} กม./ลิตร)
                                                </TableCell>
                                            )}

                                            {/* ชนิดน้ำมัน */}
                                            <TableCell sx={{ border: '1px solid rgba(0,0,0,0.2)' }}>
                                                {fuelType?.fuelName}
                                            </TableCell>

                                            {/* ราคาต่อ ลิตร */}
                                            <TableCell sx={{ border: '1px solid rgba(0,0,0,0.2)' }}>
                                                {fuelType?.fuel?.price ? fuelType?.fuel?.price?.toFixed(2) : 'N/A'}
                                            </TableCell>

                                            {/* ปริมาณน้ำมันที่ใช้ */}
                                            <TableCell sx={{ border: '1px solid rgba(0,0,0,0.2)' }}>
                                                {oilUsageInMl.toFixed(2)} ml
                                            </TableCell>

                                            {/* ปริมาณคาร์บอน */}
                                            <TableCell sx={{ border: '1px solid rgba(0,0,0,0.2)' }}>
                                                {calculateCO2E(oilUsageInLiter).toFixed(2)} kg CO2e
                                            </TableCell>

                                            {/* ค่าใช้จ่าย */}
                                            <TableCell sx={{ border: '1px solid rgba(0,0,0,0.2)' }}>
                                                {calculatePriceBath(oilUsageInMl, fuelType?.fuel?.price).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                });
                            });
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* </Card> */}
        </Grid>
        // ... (ส่วนท้ายของ component เหมือนเดิม)
    );
};
export default TravelPlanner;