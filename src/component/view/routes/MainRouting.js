import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CssBaseline,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import * as React from "react";
import { useTranslation, I18nextProvider } from "react-i18next";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme({
  typography: {
    fontFamily: "'Noto Sans Thai', 'Prompt', sans-serif",
    fontSize: 16,
  },
  palette: {
    primary: {
      main: "#007FFF",
      dark: "#0066CC",
    },
  },
});
function MainRouting({ screenWidth }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ให้แน่ใจว่า districts เป็น Array
  const districtsRaw = t("districts", { returnObjects: true });
  const districts = Array.isArray(districtsRaw) ? districtsRaw : [];
  const menuItems = districts?.map((item) => ({
    id: item.id,
    label: i18n.language === "th" ? item.name_th : item.name_en,
    type: "button",
    icon: item?.icon,
  }));

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box
          sx={{
            borderRadius: 2,
            color: "black",
            fontSize: { xs: "0.8rem", sm: "1rem" }, // ปรับขนาดตัวอักษรให้เล็กลงสำหรับมือถือ
            display: "flex",
            flexDirection: "column", // ✅ เรียงแนวตั้ง
            gap: 2, // เพิ่มระยะห่างระหว่าง item ในแนวตั้ง
          }}
        >
          <Box
            sx={{
              mx: "auto",
              my: 4,
              px: { xs: 2, sm: 4 },
              py: { xs: 2, sm: 4 },
              color: "black",
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="stretch"
            >
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "black",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  gap: 1.5,
                  borderRadius: 3,

                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.03)",
                    backgroundColor: "#006400",
                    color: "#ffffff",
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <Avatar
                  src="/calculate.jpg" // ✅ ใช้ src แสดงภาพ
                  sx={{
                    width: { xs: 24, sm: 48 },
                    height: { xs: 24, sm: 48 },
                    objectFit: "contain",
                    borderRadius: 1,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                />
                คำนวนคาร์บอนฟุตพริ้นท์
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "black",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  gap: 1.5,
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.03)",
                    backgroundColor: "#006400",
                    color: "#ffffff",
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <Avatar
                  src="/map.png" // ✅ ใช้ src แสดงภาพ
                  sx={{
                    width: { xs: 24, sm: 48 },
                    height: { xs: 24, sm: 48 },
                    objectFit: "contain",
                    borderRadius: 1,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                />
                การคำนวนคาร์บอนฟส่วนของผู้ประกอบการและองค์กร
              </Button>
            </Stack>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                width: "100%",
                fontSize: {
                  xs: "24px", // มือถือ
                  sm: "36px", // ไอแพด
                  md: "64px", // คอมพิวเตอร์
                },
                fontWeight: "bold",
                color: "#77B349", // เปลี่ยนสีตัวอักษร
              }}
            >
              R O U T I N G
            </Typography>
          </Box>
          {/* Card */}
          <Box
            sx={{
              maxWidth: { xs: "95%", sm: "80%" },
              mx: "auto",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
            >
              {menuItems?.map((item, index) => (
                <Grid
                  item
                  key={index}
                  xs={12} // 1 แถวในมือถือ (เต็มหน้าจอ)
                  sm={6} // 2 แถวในแท็บเล็ต
                  md={4} // 3 แถวในเดสก์ท็อป (12 / 4 = 3)
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Card
                    onClick={() => navigate(`/district/${item.id}`)}
                    sx={{
                      borderRadius: 7,
                      // transition: '0.3s',
                      maxWidth: "300px", // จำกัดความกว้างสูงสุด
                      width: "100%",
                      cursor: "pointer",

                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.03)",
                        backgroundColor: "#006400",
                        // 👉 ทำให้ปุ่มเปลี่ยนสีเมื่อ hover ที่ Card
                        "& .card-button": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        component="img"
                        src={`/${item?.icon}`}
                        alt={item?.label}
                        sx={{
                          width: "100%",
                          height: { xs: 160, sm: 200 }, // ปรับความสูงตามหน้าจอ
                          objectFit: "cover",
                          borderTopLeftRadius: 28,
                          borderTopRightRadius: 28,
                        }}
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Typography
                        className="card-button" // ใช้ class เพื่อให้ควบคุมจาก Card
                        sx={{
                          width: "100%",
                          justifyContent: "center",
                          display: "flex",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "black",
                          // transition: 'color 0.3s ease',
                          "&:hover": {
                            backgroundColor: "#006400",
                          },
                        }}
                      >
                        {i18n.language === "th" ? item?.label : item?.label}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default MainRouting;
