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
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export default function HeadPage({
  screenWidth,
  defaultTheme,
  isAuthenticated,
}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = screenWidth < 400;
  const isIpad = screenWidth > 401 && screenWidth < 769;
  const prefix = isMobile ? "img-mobile" : isIpad ? "img-ipad" : "img-web";

  // State สำหรับเปิด dropdown แต่ละเมนู
  const [anchorEl, setAnchorEl] = useState(null); // สำหรับ dropdown routes
  const [anchorElBaab, setAnchorElBaab] = useState(null); // สำหรับ dropdown formats
  const [anchorLang, setAnchorLang] = useState(null); // สำหรับ dropdown language
  const [anchorLogin, setAnchorLogin] = useState(null);
  const [anchorSignin, setAnchorSignin] = useState(null);
  const [anchorMobileMenu, setAnchorMobileMenu] = useState(null); // สำหรับเมนูมือถือ

  const [languageData, setLanguageData] = useState(
    i18n.language === "th"
      ? resources?.store?.data?.th?.translation
      : resources?.store?.data?.en?.translation
  );
  // const [rolesData, setRolesData] = useState(
  //     i18n.language === 'th'
  //         ? resources?.store?.data?.th?.translation?.roles
  //         : resources?.store?.data?.en?.translation?.roles
  // );

  const [language, setLanguage] = useState(i18n.language);
  const roleMap = {
    1: "admin",
    2: "admin",
    3: "user",
    37: "guest", // ตัวอย่าง: บาง role อ่านได้ แต่เขียน/ลบไม่ได้
    // เพิ่มตามจริงจาก decoded.role ที่คุณมี
  };
  const [role, setRole] = useState("guest");

  useEffect(() => {
    // แก้ไขภาษาเมื่อมีการเปลี่ยนแปลง
    const onLanguageChanged = (lng) => {
      setLanguage(lng);
      setLanguageData(
        lng === "th"
          ? resources?.store?.data?.th?.translation
          : resources?.store?.data?.en?.translation
      );
    };

    // ตั้งค่าภาษาเริ่มต้น
    onLanguageChanged(i18n.language);

    // ตรวจสอบ token และ decode JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("decoded.role", decoded.role);

        const roleIds = Object.keys(decoded.role || {});
        // เลือก role ID แรก หรือใช้ logic ที่เหมาะสมที่สุด
        const firstRoleId = roleIds[0];
        const roleName = roleMap[firstRoleId] || "guest";

        setRole(roleName); // ✅ ตั้งค่า role ที่ใช้ใน JSX ได้เลย
      } catch (err) {
        console.error("JWT decode failed", err);
        setRole("guest");
      }
    }

    // ตั้ง listener สำหรับการเปลี่ยนภาษา
    i18n.on("languageChanged", onLanguageChanged);

    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [i18n, resources]);

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

  const Logout = () => {
    localStorage.removeItem("token");
    setRole("guest");
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
    // {
    //   type: "login",
    //   label: t("login"),
    //   icon: <ContactMailIcon fontSize="small" />,
    // },
    // {
    //   type: "signin",
    //   label: t("signin"),
    //   icon: <ContactMailIcon fontSize="small" />,
    // },
    // { type: 'roles', label: t('role'), icon: <ContactMailIcon fontSize="small" /> },
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
                  {languageData?.formats?.map((format, idx) => (
                    <MenuItem
                      key={`format-${idx}`}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(`/format/${format?.id}`);
                        setAnchorMobileMenu(null);
                      }}
                    >
                      {i18n.language === "th"
                        ? format?.name_th
                        : format?.name_en}
                    </MenuItem>
                  ))}

                  <MenuItem
                    onClick={() => {
                      navigate("/about");
                      setAnchorMobileMenu(null);
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("about")}
                  </MenuItem>

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
                  {/* เมนูเพิ่มข้อมูล (เฉพาะ admin/user เท่านั้น) */}
                  {/* ถ้าเป็น guest ให้แสดงปุ่ม login + signup */}
                  {!role || role === "guest" ? (
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
                      <MenuItem
                        onClick={() => {
                          navigate("/signup");
                          setAnchorMobileMenu(null);
                        }}
                      >
                        <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                        {t("signup")}
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      {/* เพิ่มข้อมูล (เฉพาะ admin/user) */}
                      {["admin", "user"].includes(role) && (
                        <MenuItem
                          onClick={() => {
                            navigate("/add");
                            setAnchorMobileMenu(null);
                          }}
                        >
                          <AddCircleIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("add_data")}
                        </MenuItem>
                      )}

                      {/* Logout */}
                      <MenuItem
                        onClick={() => {
                          fetch("/api/logout", { method: "POST" }).then(() => {
                            localStorage.removeItem("token");
                            setRole("guest");
                            navigate("/");
                          });
                          setAnchorMobileMenu(null);
                        }}
                      >
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        {t("logout")}
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            ) : (
              <>
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
                  {role === "guest" ? (
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
                          // fontSize: "1rem",
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
                        <MenuItem
                          onClick={() => {
                            navigate("/signup");
                            handleLoginMenuClose();
                          }}
                        >
                          <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                          {t("signup")}
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
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

                <Menu
                  anchorEl={anchorElBaab}
                  open={Boolean(anchorElBaab)}
                  onClose={handleMenuCloseBaab}
                >
                  {languageData?.formats?.map((format, index) => (
                    <MenuItem
                      key={index}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        setAnchorElBaab(null);
                        navigate(`/format/${format?.id}`);
                      }}
                    >
                      {i18n.language === "th"
                        ? format?.name_th
                        : format?.name_en}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  anchorEl={anchorLang}
                  open={Boolean(anchorLang)}
                  onClose={handleLangClose}
                >
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
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
