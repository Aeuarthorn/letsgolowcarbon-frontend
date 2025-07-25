import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    Grid,
    CircularProgress
} from '@mui/material';
import { useMemo } from 'react';




export function SummaryForm() {
    const rawData = localStorage.getItem("ghg_totals");
    const countuserStr = localStorage.getItem("activity");
    const countuser = countuserStr ? JSON.parse(countuserStr) : null;
    const touristsCount = countuser && countuser.tourists ? parseInt(countuser.tourists, 10) : 0;

    const totals = rawData ? JSON.parse(rawData) : { travel: 0, foodanddrink: 0, stay: 0, waste: 0 };
    const AmountofCO2 = 89.01
    const { travel, foodanddrink, stay, waste } = totals;
    const travelTon = travel / 1000;
    const foodTon = foodanddrink / 1000;
    const stayTon = stay / 1000;
    const wasteTon = waste / 1000;

    const totalTon = travelTon + foodTon + stayTon + wasteTon;
    const total = travel + foodanddrink + stay + waste;
    const avgpersonTon = totalTon / touristsCount // ค่าเฉลี่ย / คน ตัน
    const avgperson = total / touristsCount // ค่าเฉลี่ย / คน กิโลกรัม
    const calAmountofCO2 = AmountofCO2 - avgperson // ปริมาณที่ลด CO2 จากการท่องเที่ยว (kgCO2eq)
    const calAmountofCO2COnvertPerson = (calAmountofCO2 / AmountofCO2) * 100 // ปริมาณที่ลด CO2 จากการท่องเที่ยว (kgCO2eq) แปลง
    const Equivalent = calAmountofCO2 / 12 //เทียบเท่ากับปลูกต้นไม้
    const treeEquivalent = 5;

    const ghgData = useMemo(() => [
        { source: 'การเดินทาง', value: travel },
        { source: 'อาหารและเครื่องดื่ม', value: foodanddrink },
        { source: 'การพักแรม', value: stay },
        { source: 'ของเสีย', value: waste },
    ], [travel, foodanddrink, stay, waste]);


    // console.log("touristsCount", touristsCount);
    // console.log("avgperson", avgperson);
    // console.log("total", total);
    // console.log("calAmountofCO2", calAmountofCO2);
    // console.log("calAmountofCO2COnvertPerson", calAmountofCO2COnvertPerson);
    // console.log("Equivalent", Equivalent);


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#d0fbea', borderRadius: 2 }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
                สรุปการปล่อย
            </Typography>
            {/* ตารางสรุป */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
                แหล่งปล่อยก๊าซเรือนกระจก:
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#b2dfdb' }}>
                            <TableCell><strong>แหล่งปล่อยก๊าซ</strong></TableCell>
                            <TableCell align="right"><strong>ปริมาณ CO2e (ตัน)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ghgData.map((row) => {
                            const tonValue = row.value / 1000;
                            const percent = totalTon > 0 ? (tonValue / totalTon) * 100 : 0;
                            return (
                                <TableRow key={row.source}>
                                    <TableCell>{row.source}</TableCell>
                                    <TableCell align="right">
                                        {tonValue.toFixed(4)} ({percent.toFixed(2)}%)
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell><strong>รวมทั้งหมด</strong></TableCell>
                            <TableCell align="right">
                                <strong>{totalTon.toFixed(4)} (100%)</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* สรุปปริมาณคาร์บอนฟุตพริ้นต์ */}
            <Grid container spacing={2} mt={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                ปริมาณคาร์บอนฟุตพริ้นต์รวม
                            </Typography>

                            <Typography>
                                รวม: <strong style={{ color: '#2196f3' }}>{totalTon ? totalTon.toFixed(2) : "-"}</strong> ตัน
                            </Typography>
                            <Typography>
                                จำนวนนักท่องเที่ยว: <strong style={{ color: '#2196f3' }}>{touristsCount ? touristsCount : "-"}</strong> คน
                            </Typography>
                            <Typography>
                                ค่าเฉลี่ย / คน: <strong style={{ color: '#2196f3' }}>{avgpersonTon ? avgpersonTon.toFixed(2) : "-"}</strong> ตัน
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ textAlign: 'center', p: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                ปริมาณการรับคาร์บอนฟุตพริ้นท์รวม
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {totalTon?.toFixed(2)} ตัน
                            </Typography>

                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                ค่าเฉลี่ย/คน
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {avgpersonTon?.toFixed(2)} ตัน
                            </Typography>

                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                                ปริมาณ CO2 ที่ลดได้
                            </Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={Math.round(calAmountofCO2COnvertPerson)}
                                    size={80}
                                    thickness={5}
                                    sx={{ color: '#4caf50' }}
                                />
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="h6" component="div" color="#4caf50">
                                        {Math.round(calAmountofCO2COnvertPerson)}%
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography sx={{ mt: 2 }}>
                                เทียบเท่ากับปลูกต้นไม้
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {Math.round(Equivalent)} ต้น
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
