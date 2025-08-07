import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import {
    CssBaseline,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    createTheme,
    styled,
    Grid,
    ThemeProvider,
    Typography,
    Stack,
    Divider,
    Box,
    Avatar,
    Link,
} from '@mui/material';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import MainRouteFooter from './routes/MainRouteFooter';

function About({ screenWidth, defaultTheme }) {
    const { t } = useTranslation();


    const logos = [
        { src: "img-web/logo-kku.png", link: "https://example.com/ในเมือง" },
        { src: "img-web/logo-kkbs.png", link: "https://example.com/ภูผาม่าน" },
        { src: "img-web/logo-captour.png", link: "https://example.com/อุบลรัตน์" },
        { src: "img-web/logo-kkuttravel.png", link: "https://example.com/อุบลรัตน์" },
        { src: "img-web/logo.png", link: "https://example.com/อุบลรัตน์" },
    ];
    const socialLinks = [
        { icon: "img-web/instagram.png", },
        { icon: "img-web/facebook.png" },
        { icon: "img-web/line.png" },
        { icon: "img-web/tik-tok.png" },
        { icon: "img-web/youtube.png" },
    ];

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    my: 4,
                    p: 4,
                    borderRadius: 2,
                    color: 'black',
                }}
            >
                <Typography variant="h4" sx={{ textAlign: 'center' }} gutterBottom>
                    {t('abouted.title')}
                </Typography>

                <Typography paragraph><b>{t('abouted.what_is_lglc_title')}</b></Typography>
                <Typography component="div">
                    <Trans i18nKey="abouted.what_is_lglc" components={{ p: <p />, br: <br /> }} />
                </Typography>

                <Typography paragraph><b>{t('abouted.what_is_low_carbon_society_title')}</b></Typography>
                <Typography component="div">
                    <Trans i18nKey="abouted.what_is_low_carbon_society" components={{ p: <p />, br: <br /> }} />
                </Typography>

                <Typography paragraph><b>{t('abouted.what_is_carbon_footprint_title')}</b></Typography>
                <Typography component="div">
                    <Trans i18nKey="abouted.what_is_carbon_footprint" components={{ p: <p />, br: <br /> }} />
                </Typography>

                <Typography paragraph><b>{t('abouted.what_is_low_carbon_title')}</b></Typography>
                <Typography component="div">
                    <Trans i18nKey="abouted.what_is_low_carbon" components={{ p: <p />, br: <br /> }} />
                </Typography>

                <Typography paragraph><b>{t('abouted.origin_title')}</b></Typography>
                <Typography component="div">
                    <Trans i18nKey="abouted.origin" components={{ p: <p />, br: <br /> }} />
                </Typography>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography component="div" sx={{ display: 'inline-block', textAlign: 'left', maxWidth: 900 }}>
                        <Trans i18nKey="abouted.website_origin" components={{ p: <p />, br: <br /> }} />
                    </Typography>
                </Box>
            </Box>
            <Box // 3
                component="main"
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    // backgroundColor: '#77B349', // เพิ่มพื้นหลังสีดำโปร่งแสง
                    fontSize: { xs: '0.8rem', sm: '1rem' }, // ปรับขนาดตัวอักษรให้เล็กลงสำหรับมือถือ
                    display: 'flex',
                    flexDirection: 'column', // ✅ เรียงแนวตั้ง
                    gap: 2, // เพิ่มระยะห่างระหว่าง item ในแนวตั้ง
                }}
            >
                <MainRouteFooter screenWidth={screenWidth} />
            </Box>
            {/* <Box
                sx={{
                    maxWidth: { xs: '95%', sm: 800 },
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
            </Box> */}
        </ThemeProvider>
    )
}

export default About