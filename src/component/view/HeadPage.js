import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  List,
  Container,
  useTheme,
  useMediaQuery,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  ThemeProvider,
  styled,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Button,
  Select,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Groups2Icon from '@mui/icons-material/Groups2';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LanguageIcon from "@mui/icons-material/Language";
import logo from "../../component/logo/icon_new.png";
import { useTranslation, I18nextProvider } from "react-i18next";
import { useNavigate } from "react-router-dom";
import resources from "../../i18n"; // Assuming your i18n.js file is in the parent directory
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { travel_types_guest } from "../api/API";
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export default function HeadPage({ screenWidth, defaultTheme, isAuthenticated, }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = screenWidth < 400;
  const isIpad = screenWidth > 401 && screenWidth < 900;
  const prefix = isMobile ? "img-mobile" : isIpad ? "img-ipad" : "img-web";

  // State สำหรับเปิด dropdown แต่ละเมนู
  const [anchorEl, setAnchorEl] = useState(null); // สำหรับ dropdown routes
  const [anchorElBaab, setAnchorElBaab] = useState(null); // สำหรับ dropdown formats
  const [anchorLang, setAnchorLang] = useState(null); // สำหรับ dropdown language
  const [anchorLogin, setAnchorLogin] = useState(null);
  const [anchorSignin, setAnchorSignin] = useState(null);
  const [anchorMobileMenu, setAnchorMobileMenu] = useState(null); // สำหรับเมนูมือถือ
  const [loading, setLoading] = useState(true);
  const [travelType, setTravelType] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token")
  const [languageData, setLanguageData] = useState(
    i18n.language === "th"
      ? resources?.store?.data?.th?.translation
      : resources?.store?.data?.en?.translation
  );
  const [language, setLanguage] = useState(i18n.language);
  const roleMap = {
    1: "admin",
    2: "admin",
    3: "user",
    37: "guest", // ตัวอย่าง: บาง role อ่านได้ แต่เขียน/ลบไม่ได้
    // เพิ่มตามจริงจาก decoded.role ที่คุณมี
  };
  const [role, setRole] = useState("");

  const [hasToken, setHasToken] = useState(false);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("if");
  //     return await loadTravels();
  //   };

  //   fetchData(); // เรียกใช้ async function ที่เราสร้างไว้
  // }, []); // ✅ ใส่ did ใน dependency array ให้ถูก

  // useEffect(() => {
  //   // แก้ไขภาษาเมื่อมีการเปลี่ยนแปลง
  //   const onLanguageChanged = (lng) => {
  //     setLanguage(lng);
  //     setLanguageData(
  //       lng === "th"
  //         ? resources?.store?.data?.th?.translation
  //         : resources?.store?.data?.en?.translation
  //     );
  //   };

  //   // ตั้งค่าภาษาเริ่มต้น
  //   onLanguageChanged(i18n.language);

  //   // ตรวจสอบ token และ decode JWT
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       console.log("decoded.role++++++++", decoded.role);

  //       const roleIds = Object.keys(decoded.role || {});
  //       // เลือก role ID แรก หรือใช้ logic ที่เหมาะสมที่สุด
  //       const firstRoleId = roleIds[0];
  //       const roleName = roleMap[firstRoleId] || "guest";

  //       setRole(roleName); // ✅ ตั้งค่า role ที่ใช้ใน JSX ได้เลย
  //     } catch (err) {
  //       // console.error("JWT decode failed", err);
  //       setRole("guest");
  //     }
  //   }

  //   // ตั้ง listener สำหรับการเปลี่ยนภาษา
  //   i18n.on("languageChanged", onLanguageChanged);

  //   return () => {
  //     i18n.off("languageChanged", onLanguageChanged);
  //   };
  // }, [i18n, resources]);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setHasToken(true);
  //     try {
  //       const decoded = jwtDecode(token);
  //       const roleIds = Object.keys(decoded.role || {});
  //       const firstRoleId = roleIds[0];
  //       const roleName = roleMap[firstRoleId] || "guest";
  //       setRole(roleName);
  //     } catch (err) {
  //       console.error("JWT decode failed", err);
  //       setRole("guest");
  //     }
  //   } else {
  //     setHasToken(false);
  //     setRole("guest");
  //   }
  // }, []);



  useEffect(() => {
    const fetchData = async () => {
      await loadTravels();
    };

    fetchData();

    // ฟังก์ชันจัดการเปลี่ยนภาษา
    const onLanguageChanged = (lng) => {
      setLanguage(lng);
      setLanguageData(
        lng === "th"
          ? resources?.store?.data?.th?.translation
          : resources?.store?.data?.en?.translation
      );
    };

    onLanguageChanged(i18n.language);

    // ตรวจสอบ token และ decode role
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roleIds = Object.keys(decoded.role || {});
        const firstRoleId = roleIds[0];
        const roleName = roleMap[firstRoleId] || "guest";
        setRole(roleName);
        setHasToken(true);
      } catch (err) {
        console.error("JWT decode failed", err);
        setRole("guest");
        setHasToken(false);
      }
    } else {
      setRole("guest");
      setHasToken(false);
    }

    // ตั้ง listener สำหรับการเปลี่ยนภาษา
    i18n.on("languageChanged", onLanguageChanged);

    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [i18n, resources, token]);


  const loadTravels = async () => {
    setLoading(true);
    setError(null);
    try {
      const travelTypes = await axios.get(travel_types_guest);
      console.log("✅ ดึงข้อมูลเส้นทางสำเร็จ:++++++++++", travelTypes);

      // ✅ ตรวจสอบก่อนว่าเป็น array หรือไม่
      const data = Array.isArray(travelTypes.data)
        ? travelTypes.data
        : [];

      setTravelType(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลอำเภอล้มเหลว:", error);
      setError("ไม่สามารถโหลดข้อมูลได้ในขณะนี้ โปรดลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปิด/ปิด dropdown แต่ละเมนู
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuOpenBaab = (event) => setAnchorElBaab(event.currentTarget);
  const handleMenuCloseBaab = () => setAnchorElBaab(null);

  const handleLangOpen = (event) => setAnchorLang(event.currentTarget);
  const handleLangClose = () => setAnchorLang(null);

  const [loginMenuAnchor, setLoginMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLoginMenuOpen = (event) =>
    setLoginMenuAnchor(event.currentTarget);
  const handleLoginMenuClose = () => setLoginMenuAnchor(null);

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  // ฟังก์ชัน Logout ลบ token และ reset role, hasToken
  const Logout = () => {
    localStorage.removeItem("token");
    setRole("guest");
    setHasToken(false);
    handleUserMenuClose();
    navigate("/");
  };

  // เปลี่ยนภาษา
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setLanguage(lng); // รีเฟรช UI
    });
    handleLangClose();
  };

  {
    !isAuthenticated && (
      <>
        <MenuItem onClick={() => navigate("/login")}>{t("login")}</MenuItem>
        <MenuItem onClick={() => navigate("/signup")}>{t("signup")}</MenuItem>
      </>
    );
  }

  // เมนูหลัก
  const menuItems = [
    { type: "button", label: t("home"), icon: <HomeIcon fontSize="small" /> },
    {
      type: "dropdown",
      label: t("routes"),
      icon: <MapIcon fontSize="small" />,
    },
    {
      type: "dropdownBaab",
      label: t("format"),
      icon: <ViewModuleIcon fontSize="small" />,
    },
    { type: "button", label: t("about"), icon: <InfoIcon fontSize="small" /> },
    {
      type: "button",
      label: t("contact"),
      icon: <ContactMailIcon fontSize="small" />,
    },
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#77B349" }}
          elevation={0}
        >
          <Toolbar
            sx={{
              height: "60px",
              display: "flex",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            {/* มือถือ */}
            {isMobile || isIpad ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <img src={logo} alt="Logo" style={{ height: 45 }} />
                <IconButton
                  color="inherit"
                  edge="start"
                  sx={{ mr: 2 }}
                  onClick={(e) => setAnchorMobileMenu(e.currentTarget)}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorMobileMenu}
                  open={Boolean(anchorMobileMenu)}
                  onClose={() => setAnchorMobileMenu(null)}
                  PaperProps={{ style: { minWidth: 220, borderRadius: 16 } }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("home")}
                  </MenuItem>

                  {/* Submenu: เส้นทาง/จังหวัด */}
                  <MenuItem disabled sx={{ opacity: 0.8 }}>
                    {t("routes")}
                  </MenuItem>
                  {languageData?.districts?.map((district, idx) => (
                    <MenuItem
                      key={`district-${idx}`}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(`/district/${district?.id}`);
                        setAnchorMobileMenu(null);
                      }}
                    >
                      {i18n.language === "th"
                        ? district?.name_th
                        : district?.name_en}
                    </MenuItem>
                  ))}

                  {/* Submenu: รูปแบบ */}
                  <MenuItem disabled sx={{ opacity: 0.8 }}>
                    {t("format")}
                  </MenuItem>
                  {travelType?.map((format) => {
                    // console.log("format", format);

                    return (
                      <MenuItem
                        key={`format-${format.ttid}`}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          // navigate(`/format/${format.ttid}`); // ส่ง ttid ไป
                          navigate(`/format/${format.ttid}?name=${encodeURIComponent(format.name)}`);
                          setAnchorMobileMenu(null);
                        }}
                      >
                        {format.name}
                      </MenuItem>
                    )
                  })}
                  {/* กลุ่มท่องเที่ยว */}
                  {(hasToken && role === "guest") && (
                    <>
                      <MenuItem
                        onClick={() => {
                          navigate("/tour");
                          setAnchorMobileMenu(null);
                        }}
                      >
                        <Groups2Icon fontSize="small" sx={{ mr: 1 }} />
                        {/* {t("about")} */}
                        กลุ่มท่องเที่ยว
                      </MenuItem>
                    </>
                  )}
                  {/* เกี่ยวกับ */}
                  <MenuItem
                    onClick={() => {
                      navigate("/about");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("about")}
                  </MenuItem>
                  {/* ช่องทางการติดต่อ */}
                  <MenuItem
                    onClick={() => {
                      navigate("/contact");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <ContactMailIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("contact")}
                  </MenuItem>

                  {/* ภาษา */}
                  <MenuItem disabled sx={{ opacity: 0.8 }}>
                    {t("language")}
                  </MenuItem>
                  {/* ไทย */}
                  <MenuItem
                    onClick={() => {
                      changeLanguage("th");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        backgroundColor: "transparent", // ไม่มีพื้นหลัง
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundImage: `url('/${prefix}/th.jpg')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%", // ทำให้เป็นวงกลม
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">ไทย</Typography>
                    </Box>
                  </MenuItem>
                  {/* อังกฤษ */}
                  <MenuItem
                    onClick={() => {
                      changeLanguage("en");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        backgroundColor: "transparent", // ไม่มีพื้นหลัง
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundImage: `url('/${prefix}/en.png')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%", // ทำให้เป็นวงกลม
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">English</Typography>
                    </Box>
                  </MenuItem>
                  {/* select guest */}
                  <MenuItem disabled sx={{ opacity: 0.8 }}>
                    {t("format")}
                  </MenuItem>
                  <MenuItem
                    // disabled
                    sx={{
                      opacity: 0.8,
                      justifyContent: "center",
                      fontWeight: "bold",
                      mt: 1,
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    {t("current_role")}: <strong>{t(role || "guest")}</strong>
                  </MenuItem>
                  {/* role for user */}
                  {(!hasToken && role === "guest") ? (
                    <>
                      <MenuItem
                        onClick={() => {
                          navigate("/login");
                          setAnchorMobileMenu(null);
                        }}
                      >
                        <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                        {t("login")}
                      </MenuItem>
                    </>
                  ) : (hasToken && role === "guest") && (
                    <>
                      <MenuItem
                        onClick={() => {
                          localStorage.removeItem("token");  // ลบ token ออกจาก storage
                          setLoading(true);                   // เริ่มแสดง loading
                          handleLoginMenuClose();
                          // รอโหลดหน้านิดนึงก่อน navigate (เช่น 500ms)
                          setTimeout(() => {
                            setLoading(false);                // ปิด loading
                            navigate("/");
                          }, 1500);
                        }}
                      >
                        <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                        {t("logout")}
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            ) : (
              <>
                {/* desktop */}
                <img src={logo} alt="Logo" style={{ height: 45 }} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {menuItems.map((item, idx) => (
                    <Button
                      key={idx}
                      color="inherit"
                      startIcon={item.icon}
                      onClick={(event) => {
                        if (item.type === "dropdown") {
                          handleMenuOpen(event);
                        } else if (item.type === "dropdownBaab") {
                          handleMenuOpenBaab(event);
                        } else if (item.label === t("contact")) {
                          navigate("/contact");
                        } else if (item.label === t("home")) {
                          navigate("/");
                        } else if (item.label === t("about")) {
                          navigate("/about");
                        }
                      }}
                      sx={{
                        mx: 0.5,
                        borderRadius: 2,
                        textTransform: "none",
                        // fontSize: "1rem",
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
                      }}
                      endIcon={
                        ["dropdown", "dropdownBaab", "roles"].includes(
                          item.type
                        ) ? (
                          <KeyboardArrowDownIcon fontSize="small" />
                        ) : null
                      }
                    >
                      {item.label}
                    </Button>
                  ))}
                  {/* กลุ่มท่องเที่ยว */}
                  {(hasToken && role === "guest") && (
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        navigate("/tour"); // ไปหน้ากลุ่มท่องเที่ยว
                      }}
                      sx={{
                        mx: 0.5,
                        borderRadius: 2,
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255,0,0,0.2)" },
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        {/* {t("language")} */}
                        กลุ่มท่องเที่ยว
                      </Typography>
                      <Groups2Icon fontSize="small" />
                    </IconButton>
                  )}
                  {/* ภาษา */}
                  <IconButton
                    color="inherit"
                    onClick={handleLangOpen}
                    sx={{
                      mx: 0.5,
                      borderRadius: 2,
                      transition: "background-color 0.3s ease",
                      "&:hover": { backgroundColor: "rgba(255,0,0,0.2)" },
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {t("language")}
                    </Typography>
                    <LanguageIcon fontSize="small" />
                  </IconButton>

                  {/* guest, guest have token */}
                  {(!hasToken && role === "guest") ? (
                    <>
                      <Button
                        color="inherit"
                        startIcon={<AccountCircleIcon />}
                        onClick={
                          role === "guest"
                            ? handleLoginMenuOpen
                            : handleUserMenuOpen
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          mx: 0.5,
                        }}
                        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                      >
                        {typeof role === "string" &&
                          ["guest", "admin", "user"].includes(role)
                          ? t(role)
                          : t("guest")}
                      </Button>
                      <Menu
                        anchorEl={loginMenuAnchor}
                        open={Boolean(loginMenuAnchor)}
                        onClose={handleLoginMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate("/login");
                            handleLoginMenuClose();
                          }}
                        >
                          <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("login")}
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (hasToken && role === "guest") ? (
                    <>
                      {/* not token  */}
                      <Button
                        color="inherit"
                        startIcon={<AccountCircleIcon />}
                        onClick={handleLoginMenuOpen}
                        sx={{ borderRadius: 2, textTransform: "none", mx: 0.5 }}
                        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                      >
                        {t("guest")}
                      </Button>
                      <Menu
                        anchorEl={loginMenuAnchor}
                        open={Boolean(loginMenuAnchor)}
                        onClose={handleLoginMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            localStorage.removeItem("token");  // ลบ token ออกจาก storage
                            setLoading(true);
                            navigate("/");
                            handleLoginMenuClose();
                            // รอโหลดหน้านิดนึงก่อน navigate (เช่น 500ms)
                            setTimeout(() => {
                              setLoading(false);                // ปิด loading
                              navigate("/");
                            }, 1500);
                          }}
                        >
                          <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("logout")}
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      {/* role admin, user */}
                      <Button
                        color="inherit"
                        startIcon={<AccountCircleIcon />}
                        onClick={handleUserMenuOpen}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          mx: 0.5,
                        }}
                        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                      >
                        {t(role)}
                      </Button>
                      <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate(role === "admin" ? "/admin" : "/user");
                            handleUserMenuClose();
                          }}
                        >
                          <AddCircleIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("dashboard")}
                        </MenuItem>
                        <MenuItem onClick={Logout}>
                          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("logout")}
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>
              </>
            )}
            {/* เมนู dropdown: Desktop */}
            {!isMobile && (
              <>
                {/* แนะนำเส้นทาง */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {languageData?.districts?.map((district, index) => (
                    <MenuItem
                      key={index}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        setAnchorEl(null);
                        navigate(`/district/${district?.id}`);
                      }}
                    >
                      {i18n.language === "th"
                        ? district?.name_th
                        : district?.name_en}
                    </MenuItem>
                  ))}
                </Menu>
                {/* รูปแบบ */}
                <Menu
                  anchorEl={anchorElBaab}
                  open={Boolean(anchorElBaab)}
                  onClose={handleMenuCloseBaab}
                >
                  {/* Submenu: รูปแบบ */}
                  {travelType?.map((format) => {
                    return (
                      <MenuItem
                        key={`format-${format?.ttid}`}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          navigate(`/format/${format?.ttid}?name=${encodeURIComponent(format?.name)}`);
                          setAnchorElBaab(null);
                        }}
                      >
                        {format?.name}
                      </MenuItem>
                    )
                  })}
                </Menu>
                {/* ภาษา */}
                <Menu
                  anchorEl={anchorLang}
                  open={Boolean(anchorLang)}
                  onClose={handleLangClose}
                >
                  {/* ไทย */}
                  <MenuItem
                    onClick={() => {
                      changeLanguage("th");
                      setAnchorLang(null);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        backgroundColor: "transparent", // ไม่มีพื้นหลัง
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundImage: `url('/${prefix}/th.jpg')`,
                          // `${prefix}/อำเภอเมือง.jpg`
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%", // ทำให้เป็นวงกลม
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">ไทย</Typography>
                    </Box>
                  </MenuItem>
                  {/* อังกฤษห */}
                  <MenuItem
                    onClick={() => {
                      changeLanguage("en");
                      setAnchorLang(null);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        backgroundColor: "transparent", // ไม่มีพื้นหลัง
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundImage: `url('/${prefix}/en.png')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%", // ทำให้เป็นวงกลม
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">English</Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar >
      </Box >
    </ThemeProvider >
  );
}
