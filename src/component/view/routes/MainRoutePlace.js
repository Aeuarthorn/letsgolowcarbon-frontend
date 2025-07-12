import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  Button,
} from '@mui/material';

function MainRoutePlace() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Section 1: รูปภาพ + ข้อมูล */}
      <Grid container spacing={4}>
        {/* รูปภาพ */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/images/phachonlasun.jpg" // เปลี่ยน path ให้ตรงกับรูปของคุณ
            alt="ผาชมตะวัน"
            sx={{ width: '100%', borderRadius: 3 }}
          />
        </Grid>

        {/* ข้อมูลรายละเอียด */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            ผาชมตะวัน
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">
            ประวัติและความเป็นมา
          </Typography>
          <Typography variant="body2" mb={2}>
            ผาชมตะวัน ตั้งอยู่บนเทือกเขาภูเวียง เห็นวิวได้ 180 องศา เป็นจุดชมวิวพระอาทิตย์ขึ้นสุดสวยในขอนแก่น...
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">กิจกรรม</Typography>
          <Typography variant="body2" mb={2}>เดินป่า, ชมวิวถ่ายภาพ</Typography>

          <Typography variant="subtitle1" fontWeight="bold">ค่าใช้จ่าย</Typography>
          <Typography variant="body2" mb={2}>รวมค่าบำรุงสถานที่</Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="subtitle2">การรองรับนักท่องเที่ยว</Typography>
                <Typography variant="h6" fontWeight="bold">100 คน</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="subtitle2">เวลาทำการ</Typography>
                <Typography variant="body1">08:30-16:30น.</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="subtitle2">ฤดูกาลท่องเที่ยว</Typography>
                <Typography variant="body1">ตลอดปี</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="subtitle2">คาร์บอนฟุตพริ้นต์</Typography>
                <Typography variant="body1">ตลอดปี</Typography>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold">การใช้พลังงาน</Typography>
          <Stack direction="row" spacing={2} my={1}>
            <Chip label="การใช้ไฟฟ้า: 0 หน่วย" />
            <Chip label="การใช้น้ำ: 0 ลบ.ม." />
            <Chip label="การใช้น้ำมัน: 0 ลิตร" />
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">การจัดการขยะ</Typography>
          <Typography variant="body2">มีระบบแยกขยะ ลดการใช้พลาสติก</Typography>

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>ผู้ดูแล/ติดต่อสอบถาม</Typography>
          <Typography variant="body2">อุทยานแห่งชาติภูเวียง จ.ขอนแก่น <br />โทร 043-358073</Typography>
        </Grid>
      </Grid>

      {/* Section 2: Google Map */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          แผนที่
        </Typography>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            width: '100%',
            height: { xs: 300, md: 450 },
          }}
        >
          {/* <iframe
            title="map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.57423210628!2d102.37298631446641!3d16.651234788517915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31228d3a6fa7b0f1%3A0x91d97b2f5e06569d!2z4Lij4LmJ4Liy4LiZ4Li04LiV4Lin4Lix4LiZ4LmA4Lih4Liq4Li04LiU4LmA4Lih4LmJ!5e0!3m2!1sth!2sth!4v1650000000000!5m2!1sth!2sth"
          /> */}
        </Box>
      </Box>
    </Box>
  );
}

export default MainRoutePlace;
