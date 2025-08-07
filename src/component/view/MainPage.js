import React, { useEffect, useState } from 'react';
import {
    Box,
    CssBaseline,
    Grid,
    IconButton,
    ThemeProvider,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import Store from '../../Store';
import MainRouting from './routes/MainRouting';
import MainRouteTraval from './routes/MainRouteTraval';
import MainRouteFooter from './routes/MainRouteFooter';

function MainPage({ screenWidth, defaultTheme }) {
    const { t, i18n } = useTranslation();
    const [index, setIndex] = useState(0);
    const isMobile = screenWidth < 400;
    const isIpad = screenWidth > 401 && screenWidth < 768;

    // สร้าง state เพื่อบังคับ rerender เมื่อเปลี่ยนภาษา
    const [language, setLanguage] = useState(i18n.language);

    const prefix = isMobile
        ? 'img-mobile'
        : isIpad
            ? 'img-ipad'
            : 'img-web';


    // ตั้ง listener ภาษาเปลี่ยน
    useEffect(() => {
        const onLanguageChanged = (lng) => {
            setLanguage(lng);
        };

        i18n.on('languageChanged', onLanguageChanged);
        return () => {
            i18n.off('languageChanged', onLanguageChanged);
        };

    }, []);



    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const nextSlide = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // console.log("prefix", prefix);

    const images = language === 'th'
        ? [
            `${prefix}/อำเภอเมือง.jpg`,
            `${prefix}/ภูผาม่าน.jpg`,
            `${prefix}/อุบลรัตน์.jpg`,
            `${prefix}/ภูเวียง.jpg`,
            `${prefix}/น้ำพอง.jpg`,
            `${prefix}/ภูเวียง.jpg`,
        ]
        : [
            `${prefix}/mueang.jpg`,
            `${prefix}/phuphaman.jpg`,
            `${prefix}/ubolrat.jpg`,
            `${prefix}/phuwiang.jpg`,
            `${prefix}/namphong.jpg`,
            `${prefix}/sichompgu.jpg`,
        ];

    return (
        <ThemeProvider theme={defaultTheme}>
            <Provider store={Store}>
                <CssBaseline />
                <Grid
                    sx={{
                        minHeight: '100vh',
                        fontWeight: 'bold',
                        color: '#000000',
                        position: 'relative',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        component="main"
                        // sx={{
                        //     height: "100vh",
                        //     alignItems: "center",
                        //     justifyContent: "center",
                        //     overflow: "hidden",
                        // }}
                        sx={{
                            height: { xs: '70vh', sm: '80vh', md: '100vh' }, // Responsive สูง
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            position: 'relative',
                        }}
                    >
                        <img
                            src={images[index]}
                            alt={`Slide ${index}`}
                            // style={{
                            //     width: "100%",
                            //     maxHeight: "100vh",
                            //     objectFit: "cover",
                            //     transition: "all 0.5s ease-in-out",
                            // }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "all 0.5s ease-in-out",
                            }}
                        />

                        <IconButton
                            onClick={prevSlide}
                            sx={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "white" }}
                        >
                            <ArrowBackIos />
                        </IconButton>

                        <IconButton
                            onClick={nextSlide}
                            sx={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", color: "white" }}
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    </Box>
                    <Box // 2
                        component="main"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            position: 'relative',  // ต้องกำหนดเพื่อให้ ::before ทำงาน
                            backgroundImage: `url('/backgroun.png')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',

                            // ✅ เพิ่ม overlay จางๆ ด้วย pseudo-element
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.4)', // สีขาวจาง // ปรับค่าความจาง (0.1 = จางน้อย, 0.5 = มืดลง)
                                zIndex: 1,
                            },
                            // ✅ ยก zIndex ให้เนื้อหาอยู่บน overlay
                            '& > *': {
                                position: 'relative',
                                zIndex: 2,
                            },
                        }}

                    >
                        <MainRouting screenWidth={screenWidth} />
                    </Box>
                    <Box // 3
                        component="main"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            position: 'relative',
                            backgroundColor: '#77B349', // เพิ่มพื้นหลังสีดำโปร่งแสง
                            fontSize: { xs: '0.8rem', sm: '1rem' }, // ปรับขนาดตัวอักษรให้เล็กลงสำหรับมือถือ
                            display: 'flex',
                            flexDirection: 'column', // ✅ เรียงแนวตั้ง
                            gap: 2, // เพิ่มระยะห่างระหว่าง item ในแนวตั้ง
                        }}
                    >
                        <MainRouteTraval />
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
                </Grid>
            </Provider>
        </ThemeProvider>
    )
}

export default MainPage