import React from 'react';
import { Box, Button, Grid, Typography, Link, Stack, Avatar, createTheme, ThemeProvider, CardActions, CardContent, Card } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // ใช้สำหรับลิงก์ภายในแอป
import { useTranslation } from 'react-i18next';


function Nam_Phong_district({ screenWidth, defaultTheme, id }) {
  const { t, i18n } = useTranslation();
  const districts = t('districts', { returnObjects: true });
  const head_tourist_routes = t('head_tourist_routes', { returnObjects: true });

  // หาข้อมูลตาม id
  const selectedDistrict = districts?.find((item) => item.id === id);
  const language = i18n.language === 'th' ? selectedDistrict?.name_th : selectedDistrict?.name_en;

  const menuItems = districts?.map((item) => ({
    id: item.id,
    label: i18n.language === 'th' ? item.name_th : item.name_en,
    type: 'button',
    icon: item?.icon
  }));

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid item xs={24}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundImage: `url('/img-web/ในเมือง_.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box
            alignItems="center"
            justifyContent="center"
            sx={{
              pt: '20px',
              textAlign: 'center',
              color: '#ffffff',
              zIndex: 1, // ให้แน่ใจว่าอยู่ด้านบนของ ::after
              maxWidth: {
                xs: '90%',  // 90% บนมือถือ
                sm: '80%',  // 80% บนแท็บเล็ต
                md: '60%',  // 60% บนเดสก์ท็อป
              },
              mx: 'auto', // center horizontally
            }}
          >
            < Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '1.8rem', // มือถือ
                  sm: '2.5rem',
                  md: '3rem',
                },
                color: '#ffffff',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {head_tourist_routes}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mt: 1,
                fontSize: {
                  xs: '1.2rem',
                  sm: '1.8rem',
                  md: '2rem',
                },
                color: '#ffffff',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {language}
            </Typography>
            {/* VDO */}
            <Box
              sx={{
                maxWidth: { xs: '95%', sm: '80%' },
                mx: 'auto',
                p: 4,
                borderRadius: 2,
              }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {menuItems.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}     // 1 แถวในมือถือ (เต็มหน้าจอ)
                    sm={6}      // 2 แถวในแท็บเล็ต
                    md={4}      // 3 แถวในเดสก์ท็อป (12 / 4 = 3)
                    sx={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius: 7,
                        maxWidth: '300px',
                        width: '100%',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'scale(1.03)',
                          // backgroundColor: '#006400',

                        },
                      }}
                    >
                      <Box
                        component="video"
                        src={item.videoSrc} // เช่น "/videos/myvideo.mp4"
                        controls
                        muted
                        style={{
                          width: '100%',
                          height: '200px',
                          // objectFit: 'cover',
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* routes */}
            <Box
              sx={{
                maxWidth: { xs: '95%', sm: '80%' },
                mx: 'auto',
                p: 4,
                borderRadius: 2,
              }}            >
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {t('route_nam_phong', { returnObjects: true }).map((route, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Card
                      component={RouterLink}
                      to={`/district/nam_phong/${route.id}`}
                      sx={{
                        borderRadius: 7,
                        maxWidth: '300px',
                        width: '100%',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'scale(1.03)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={route.image}
                        alt={route.name}
                        sx={{
                          width: '100%',
                          height: { xs: 160, sm: 200 },
                          objectFit: 'cover',
                          borderTopLeftRadius: 28,
                          borderTopRightRadius: 28,
                        }}
                      />
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: 'black',
                            textAlign: 'center',
                          }}
                        >
                          {route.name}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid>
    </ThemeProvider>
  )
}

export default Nam_Phong_district