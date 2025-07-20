import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

const travelData = [
  {
    route: "บึงหนองแวงตราชู - Baan Heng",
    distance: 4.88,
    vehicles: [
      {
        type: "มอเตอร์ไซค์ (40km/1L)",
        fuels: [
          {
            name: "แก๊สโซฮอล์ 91",
            price: 35.28,
            volume: 122.0,
            co2: 0.28,
            cost: 4.3,
          },
          {
            name: "แก๊สโซฮอล์ 95",
            price: 35.65,
            volume: 122.0,
            co2: 0.28,
            cost: 4.35,
          },
          {
            name: "แก๊สโซฮอล์ E20",
            price: 33.5,
            volume: 122.0,
            co2: 0.28,
            cost: 4.09,
          },
        ],
      },
      {
        type: "รถยนต์ (15km/1L)",
        fuels: [
          {
            name: "แก๊สโซฮอล์ 91",
            price: 35.28,
            volume: 325.54,
            co2: 0.74,
            cost: 11.48,
          },
          {
            name: "แก๊สโซฮอล์ E20",
            price: 33.5,
            volume: 325.54,
            co2: 0.74,
            cost: 10.91,
          },
        ],
      },
      {
        type: "รถตู้ (10km/1L)",
        fuels: [
          {
            name: "ดีเซล B7",
            price: 32.94,
            volume: 488.0,
            co2: 1.1,
            cost: 16.07,
          },
          {
            name: "ดีเซล Premium",
            price: 44.94,
            volume: 488.0,
            co2: 1.1,
            cost: 21.94,
          },
        ],
      },
    ],
  },
  // 🔁 สามารถเพิ่มเส้นทางอื่น ๆ แบบเดียวกันนี้ได้
];

const TravelTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell rowSpan={2}>
              <b>เส้นทาง</b>
            </TableCell>
            <TableCell rowSpan={2}>
              <b>ระยะทาง</b>
            </TableCell>
            <TableCell rowSpan={2}>
              <b>พาหนะที่ใช้ในการเดินทาง</b>
            </TableCell>
            <TableCell colSpan={5} align="center">
              <b>การคำนวณและค่าใช้จ่าย</b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>น้ำมัน</TableCell>
            <TableCell>ราคาลิตรละ</TableCell>
            <TableCell>ปริมาณที่ใช้</TableCell>
            <TableCell>ปริมาณคาร์บอน</TableCell>
            <TableCell>จำนวน (บาท)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {travelData.map((routeRow, routeIdx) => {
            const routeVehicleCount = routeRow.vehicles.reduce(
              (sum, v) => sum + v.fuels.length,
              0
            );

            let vehicleRowIndex = 0;

            return routeRow.vehicles.map((vehicle, vIdx) => {
              return vehicle.fuels.map((fuel, fIdx) => {
                return (
                  <TableRow key={`${routeIdx}-${vIdx}-${fIdx}`}>
                    {/* เส้นทาง (แสดงแค่แถวแรกของกลุ่ม) */}
                    {vIdx === 0 && fIdx === 0 && (
                      <TableCell rowSpan={routeVehicleCount}>
                        <Typography variant="body2">
                          {routeRow.route}
                        </Typography>
                      </TableCell>
                    )}

                    {/* ระยะทาง */}
                    {vIdx === 0 && fIdx === 0 && (
                      <TableCell rowSpan={routeVehicleCount}>
                        {routeRow.distance}
                      </TableCell>
                    )}

                    {/* ประเภทพาหนะ (merge เฉพาะ row ของพาหนะนั้นๆ) */}
                    {fIdx === 0 && (
                      <TableCell rowSpan={vehicle.fuels.length}>
                        {vehicle.type}
                      </TableCell>
                    )}

                    {/* ข้อมูลน้ำมัน */}
                    <TableCell>{fuel.name}</TableCell>
                    <TableCell>{fuel.price.toFixed(2)}</TableCell>
                    <TableCell>{fuel.volume.toFixed(2)} ml</TableCell>
                    <TableCell>{fuel.co2.toFixed(2)} kg CO₂e</TableCell>
                    <TableCell>{fuel.cost.toFixed(2)}</TableCell>
                  </TableRow>
                );
              });
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TravelTable;
