import React from 'react';
import {
    Box,
    Typography,
    Container,
    Divider,
    Paper,
    createTheme,
} from '@mui/material';
import MainRouteFooter from './routes/MainRouteFooter'

function TermofService({ screenWidth, defaultTheme }) {
    return (
        <>
            <Box sx={{ bgcolor: '#f5fdf7', py: { xs: 4, md: 6 } }}>
                <Container sx={{ maxWidth: '800px' }}>
                    {/* <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}> */}
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 700, color: 'success.main' }}
                    >
                        เงื่อนไขและข้อตกลงการให้บริการ
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        gutterBottom
                    >
                        ปรับปรุงล่าสุด 6 ตุลาคม 2566
                    </Typography>
                    <Divider sx={{ my: 3 }} />

                    <Box>
                        {/* <Typography variant="h6" gutterBottom>
                            ปรับปรุงล่าสุด 6 ตุลาคม 2566
                        </Typography> */}

                        <Typography variant="body1" paragraph>
                            ข้อตกลงการให้บริการนี้ ("ข้อตกลง") เป็นเอกสารที่กำหนดเงื่อนไขและข้อกำหนดในการใช้งานเว็บไซต์ <strong>www.letgolowcarbon.com</strong> ("เว็บไซต์")
                            โปรดอ่านข้อตกลงนี้อย่างละเอียดก่อนที่คุณจะเข้าถึงหรือใช้บริการในเว็บไซต์ของเรา โดยมีรายละเอียดดังนี้
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">1. การยอมรับข้อกำหนด</Typography>
                        <Typography variant="body1" paragraph>
                            การเข้าถึงหรือใช้งาน www.letgolowcarbon.com (เว็บไซต์) หมายถึงคุณยินยอมที่จะปฏิบัติตามและยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ <br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">2. การเข้าสู่ระบบของผู้ดูแลระบบ</Typography>
                        <Typography variant="body1" paragraph>
                            คุณต้องรับผิดชอบในการรักษาความลับของข้อมูลบัญชีของคุณ<br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">3. พฤติกรรมของผู้ใช้</Typography>
                        <Typography variant="body1" paragraph>
                            คุณยินยอมที่จะไม่ทำกิจกรรมที่ผิดกฎหมายหรือถูกห้ามบนเว็บไซต์ และเคารพสิทธิและความเป็นส่วนตัวของบุคคลในรูปภาพหรือสถานที่ต่าง ๆ ที่ปรากฏบนเว็บไซต์<br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">4. เนื้อหา</Typography>
                        <Typography variant="body1" paragraph>
                            <li> คุณอาจสามารถโพสต์หรืออัปโหลดเนื้อหาบนเว็บไซต์ได้ คุณรับผิดชอบสำหรับเนื้อหาที่คุณส่ง<br /> </li>
                            <li> เราขอสงวนสิทธิ์ในการลบหรือดูแลระเบียบเนื้อหาใดๆ ที่ละเมิดข้อกำหนดเหล่านี้ </li>
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">5. ทรัพย์สินทางปัญญา</Typography>
                        <Typography variant="body1" paragraph>
                            <li> เนื้อหาและรูปภาพเว็บไซต์ได้รับการคุ้มครองด้วยสิทธิทรัพย์สินทางปัญญา<br /> </li>
                            <li>คุณไม่สามารถใช้ ทำสำเนา หรือกระจายเนื้อหาใดๆ โดยไม่ได้รับอนุญาต<br />  </li>
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">6. ความเป็นส่วนตัว</Typography>
                        <Typography variant="body1" paragraph>
                            การใช้งานของคุณบนเว็บไซต์ยังได้รับการควบคุมโดยนโยบายความเป็นส่วนตัวของเรา ซึ่งอธิบายถึงวิธีการเราเก็บข้อมูลและใช้งานข้อมูลของคุณ<br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">7. การปฏิเสธความรับผิด</Typography>
                        <Typography variant="body1" paragraph>
                            เราไม่รับผิดชอบต่อความเสียหายหรือขาดทุนใดๆ ที่เกิดขึ้นจากการใช้งานเว็บไซต์<br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">8. กฎหมายที่บังคับ</Typography>
                        <Typography variant="body1" paragraph>
                            ข้อกำหนดเหล่านี้ได้รับการควบคุมโดยกฎหมายของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล<br />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">9. การเปลี่ยนแปลงข้อกำหนด</Typography>
                        <Typography variant="body1" paragraph>
                            <li> ข้อกำหนดเหล่านี้ได้รับการควบคุมโดยกฎหมายของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล</li>
                            <li> ข้อกำหนดเหล่านี้ได้รับการควบคุมโดยกฎหมายของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล<br /></li>
                        </Typography>
                    </Box>
                </Container>
            </Box>
            <Divider sx={{ my: 0 }} />
            <Box sx={{ bgcolor: '#f5fdf7', }}>
                <MainRouteFooter />
            </Box>

        </>
    )
}

export default TermofService