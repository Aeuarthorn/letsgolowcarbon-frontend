import { Box, Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme, Stack, Avatar, Link } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

const defaultTheme = createTheme({
    typography: {
        fontFamily: "'Noto Sans Thai', 'Prompt', sans-serif",
        fontSize: 16,
    },
    palette: {
        primary: {
            main: '#007FFF',
            dark: '#0066CC',
        },
    },
});

function MainRouteFooter() {
    const { t } = useTranslation();


    const logos = [
        { src: "/logo-kku.png", link: "https://www.kku.ac.th/" },
        { src: "/logo-kkbs.png", link: "https://kkbs.kku.ac.th/" },
        { src: "/logo-captour.png", link: "https://kkbs.kku.ac.th/?lang=en" },
        { src: "/logo-kkuttravel.png", link: "https://kkbs.kku.ac.th/web/page-tour.php" },
        { src: "/logo.png", link: "https://example.com" },
    ];
    const socialLinks = [
        { icon: "/instagram.png", },
        { icon: "/facebook.png" },
        { icon: "/line.png" },
        { icon: "/tik-tok.png" },
        { icon: "/youtube.png" },
    ];
    return (
        <ThemeProvider
            theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    maxWidth: { xs: '95%', sm: 800 },
                    mx: 'auto',
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
                        mt={2}
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
        </ThemeProvider>
    )
}

export default MainRouteFooter