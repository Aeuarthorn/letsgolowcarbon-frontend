import React from 'react';
import { Box, Button, Grid, Typography, Link, Stack, Avatar, createTheme, ThemeProvider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import { useTranslation } from 'react-i18next';

const logos = [
  { src: "/logo-kku.png", link: "https://example.com/ในเมือง" },
  { src: "/logo-kkbs.png", link: "https://example.com/ภูผาม่าน" },
  { src: "/logo-captour.png", link: "https://example.com/อุบลรัตน์" },
  { src: "/logo-kkuttravel.png", link: "https://example.com/อุบลรัตน์" },
  { src: "/logo.png", link: "https://example.com/อุบลรัตน์" },
];
const socialLinks = [
  { icon: "/instagram.png", label: "Let’s Go Low Carbon" },
  { icon: "/facebook.png", label: "Let’s Go Low Carbon" },
  { icon: "/line.png", label: "@LetsGoLowCarbon" },
  { icon: "/tik-tok.png", label: "letsgolowcarbon" },
  { icon: "/youtube.png", label: "Let’s go Low carbon" },
];

function Contact({ screenWidth, defaultTheme }) {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container sx={{
        minHeight: '100vh',
        fontWeight: 'bold',      // หรือใช้ตัวเลข: 600, 700
        color: '#000000',         // สีดำ
      }}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}
          sx={{
            display: 'flex',
            justifyContent: {
              xs: 'flex-start',  // ดันขึ้นบนสำหรับมือถือ
              md: 'center',      // จัดกลางสำหรับจอใหญ่
            },
            alignItems: {
              xs: 'flex-start',  // ดันขึ้นบน
              md: 'center',      // กึ่งกลางแนวตั้ง
            },
            minHeight: {
              xs: 'auto',        // ให้สูงตามเนื้อหาสำหรับมือถือ
              md: '100vh',       // เต็มหน้าจอเฉพาะ Desktop
            },
            overflowY: 'auto',
            backgroundColor: '#f7f7f7',
            p: 4,
            pt: { xs: 6, sm: 8 }, // เพิ่ม padding-top สำหรับมือถือ เพื่อดันเนื้อหาให้ห่างจากขอบ
          }}>
          <Stack spacing={3} alignItems="center" width="100%">
            <Button variant="outlined" sx={{ borderRadius: 10, px: 4, fontSize: { xs: '0.80rem', sm: '1rem' }, fontWeight: 600 }}>
              <b>ช่องทางการติดต่อ</b>
            </Button>

            <Stack spacing={1} width="100%" justifyContent="center" alignItems="center">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Avatar
                    src={item?.icon}
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
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.80rem', sm: '1rem' },
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  >
                    {item.label}
                  </Typography>
                </a>
              ))}
            </Stack>

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
              <Typography variant="body2" sx={{ fontSize: { xs: '0.80rem', sm: '1rem' }, fontWeight: 500 }}>
                LET’S GO LOW CARBON BY CAPTOUR & KKU TRAVEL, KKBS, KKU © 2023
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                justifyContent="center"
                mt={1}
                alignItems="center"
              >
                {/* <Link component={RouterLink} to="/privacy" underline="hover">
                {t('menu.privacy_policy')}
              </Link> */}
                {[
                  { to: "/privacy", label: t('menu.privacy_policy') },
                  { to: "/terms", label: t('menu.terms') },
                  { to: "/contact", label: t('menu.contacts') },
                  { to: "/about", label: t('menu.abouts') }
                ].map((item, index) => (
                  <Link
                    key={index}
                    component={RouterLink}
                    to={item.to}
                    underline="hover"
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.8rem' },
                      fontWeight: 400,
                      color: 'inherit'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT SIDE: BACKGROUND IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',       // <-- เพิ่มตรงนี้
              width: '100%',
              height: {
                xs: '40vh', // สำหรับมือถือ ให้สูงประมาณ 40% ของหน้าจอ
                sm: '50vh',
                md: '100vh', // สำหรับ desktop
              },
              backgroundImage: `url('/img-web/สีชมพู_.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)', // สีขาวจาง
                pointerEvents: 'none',    // ป้องกันไม่ให้ ::after บล็อกการคลิก
              },
            }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Contact;
