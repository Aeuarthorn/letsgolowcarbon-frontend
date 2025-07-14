import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function SouvenirsDetail() {
  const EnergyItem = ({ icon, label, value, unit, color }) => (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        minWidth: 200,
        flex: 1,
        bgcolor: "#fffdf8",
      }}
      elevation={2}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value} <Typography variant="caption">{unit}</Typography>
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* ภาพและแผนที่ */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image="/path-to-image.jpg" // เปลี่ยนเป็น path ที่คุณเก็บรูป
              alt="ผาชมตะวัน"
            />
          </Card>
        </Grid>

        {/* ข้อมูลรายละเอียด */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ผาชมตะวัน
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            ประวัติความเป็นมา
          </Typography>

          {/* ย่อหน้า 1 */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            ผาชมตะวัน จากตัวจังหวัดขอนแก่น ใช้เส้นทางหลวงแผ่นดินหมายเลข 12 (ขอนแก่น-ชุมแพ)
            ผ่านอำเภอบ้านฝาง อำเภอหนองเรือ ระยะทางประมาณ 48 กิโลเมตร แยกขวาเข้าทางหลวงหมายเลข 2038
            เป็นระยะทาง 18 กิโลเมตร ถึงอำเภอภูเวียง แล้วใช้เส้นทางภูเวียง-บ้านเมืองใหม่
            ไปจนถึงกิโลเมตรที่ 30 เลี้ยวซ้ายตรงทางเข้าอ่างเก็บน้ำบ้านโพธิ์
            เป็นระยะทาง 8 กิโลเมตร ถึงที่ทำการอุทยานแห่งชาติภูเวียง

            จากนั้นเดินทางโดยรถยนต์ขึ้นเขาอีกประมาณ 10 กิโลเมตร
            อยู่ห่างจากน้ำตกตาดฟ้าประมาณ 2 กิโลเมตร เป็นหน้าผาหิน
            เกิดจากการยกตัวของแผ่นเปลือกโลกและรอยเลื่อน
            ทำให้เกิดลักษณะเป็นหน้าผาสูงชันตลอดแนวเทือกเขา

            โดยเฉพาะบริเวณเทือกเขาด้านทิศตะวันออกของพื้นที่อุทยานแห่งชาติภูเวียง
            เป็นจุดสนใจของนักท่องเที่ยวที่เข้ามาชมความงามของพระอาทิตย์ยามเช้าเมื่อโผล่พ้นจากขอบฟ้า
            สามารถมองเห็นทัศนียภาพอันสวยงามเบื้องล่างและสามารถมองเห็นอ่างเก็บน้ำเขื่อนอุบลรัตน์ได้
            นับว่าเป็นจุดชมพระอาทิตย์ขึ้นในตอนเช้าที่สวยงามอีกจุดหนึ่งของจังหวัดขอนแก่น
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            กิจกรรม
          </Typography>
          <Typography>เดินป่า ชมวิวถ่ายภาพ</Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            ค่าธรรมเนียม
          </Typography>
          <Typography>รวมค่าบำรุงรักษาสถานที่</Typography>

          <Divider sx={{ my: 3 }} />
          {/* ข้อมูลการใช้งาน */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              รายละเอียดสถานที่
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="h4" color="primary">
                    100
                  </Typography>
                  <Typography variant="body2">การตรวจวัดนักท่องเที่ยว</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="h6">08:30-16:30</Typography>
                  <Typography variant="body2">เวลาทำการ</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="body1">-</Typography>
                  <Typography variant="body2">คู่มือท่องเที่ยว</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <Typography variant="body1">-</Typography>
                  <Typography variant="body2">การเข้าถึงเว็บไซต์</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* ข้อมูลสิ่งแวดล้อม */}
          <Divider sx={{ my: 3 }} />
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" gutterBottom>
                การใช้พลังงาน
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 3 }}
              >
                <EnergyItem
                  icon={<FlashOnIcon />}
                  label="การใช้ไฟฟ้า"
                  value="0"
                  unit="หน่วย ⚡"
                  color="orange"
                />
                <EnergyItem
                  icon={<OpacityIcon />}
                  label="การใช้น้ำ"
                  value="0"
                  unit="ลิตร 💧"
                  color="skyblue"
                />
                <EnergyItem
                  icon={<LocalGasStationIcon />}
                  label="การใช้น้ำมัน"
                  value="0"
                  unit="ลิตร/วัน ⛽"
                  color="gray"
                />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                การจัดการน้ำและการปล่อยน้ำเสีย
              </Typography>
              <Typography>0</Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                การจัดการขยะ
              </Typography>
              <Typography>มีระบบแยกขยะ ลดการใช้พลาสติก</Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                การปล่อยคาร์บอนของสถานที่ท่องเที่ยว
              </Typography>
              <Typography>
                มีแผนและหลอดไฟใช้ได้วัสดุที่ช่วยลดลายคาร์บอน
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mt: 4 }}>
                ติดต่อสอบถาม
              </Typography>
              <Typography>043-358073</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                ที่ตั้ง
              </Typography>
              <Typography>
                ตำบลเขาน้อยภูเวียง อำเภอในเมือง จังหวัดขอนแก่น
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                หมายเหตุ
              </Typography>
              <Typography>-</Typography>
            </Box>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" />
                <Typography variant="body2">Admin</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2">7 เดือนที่แล้ว</Typography>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SouvenirsDetail;
