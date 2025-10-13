// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Avatar,
// } from "@mui/material";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import { useTranslation } from "react-i18next";
// import logo from "./component/logo/icon_new.png";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// function LoginPage({ onLoginSuccess }) {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         const token = data.token;
//         const name = data.name;
//         const role = data.role;

//         // 🔐 Decode JWT เพื่อดึงข้อมูลภายใน (role, user_id)
//         const decoded = jwtDecode(token);
//         console.log("🔓 Decoded JWT:", decoded);

//         // 🧠 เก็บ token ไว้ใน localStorage หรือ sessionStorage
//         localStorage.setItem("token", token);
//         localStorage.setItem("name", name);
//         localStorage.setItem("role", role);


//         // ⬅️ ส่งข้อมูล role กลับไปให้ App หรือ context
//         if (onLoginSuccess) onLoginSuccess(decoded); // ส่ง decoded กลับไป
//         if (decoded?.role === "admin") {
//           navigate("/admin");
//         } else if (decoded?.role === "user") {
//           navigate("/user");
//         } else {
//           navigate("/");
//         }
//         setLoading(false);
//         window.location.reload();
//       } else {
//         alert("เข้าสู่ระบบไม่สำเร็จ");
//         setLoading(false);
//       }
//     } catch (err) {
//       alert("เกิดข้อผิดพลาด");
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#e8f5e9", // เขียวพาสเทล (พื้นหลังธรรมชาติ)
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 2,
//         backgroundImage: 'url("/images/leaf-bg.png")', // ถ้ามีภาพพื้นหลังใบไม้
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           p: 4,
//           width: "100%",
//           maxWidth: 450,
//           borderRadius: 4,
//           backgroundColor: "#f1f8e9", // เขียวอ่อนแบบ organic
//           boxShadow: "0 8px 24px rgba(76, 175, 80, 0.2)",
//         }}
//       >
//         <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
//           <img
//             src={logo}
//             alt="Logo"
//             style={{
//               height: 80,

//               filter: "drop-shadow(0 0 2px #2e7d32)", // เงาสีเขียวเข้มช่วยให้ภาพดูเด่น
//             }}
//           />
//           {/* <Typography
//             variant="h5"
//             sx={{
//               color: "#388e3c",
//               mt: 1,
//               fontWeight: "bold",
//               fontFamily: "sans-serif",
//             }}
//           >
//             {t("login")}
//           </Typography> */}
//         </Box>

//         <TextField
//           fullWidth
//           label={t("email")}
//           margin="normal"
//           variant="outlined"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           sx={{
//             backgroundColor: "#ffffff",
//             borderRadius: 3,
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#81c784",
//               },
//             },
//           }}
//         />

//         <TextField
//           fullWidth
//           label={t("password")}
//           type="password"
//           margin="normal"
//           variant="outlined"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           sx={{
//             backgroundColor: "#ffffff",
//             borderRadius: 3,
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#81c784",
//               },
//             },
//           }}
//         />

//         <Button
//           fullWidth
//           variant="contained"
//           sx={{
//             mt: 3,
//             backgroundColor: "#66bb6a",
//             color: "#fff",
//             fontWeight: "bold",
//             borderRadius: 2,
//             textTransform: "none",
//             fontSize: "1rem",
//             "&:hover": {
//               backgroundColor: "#4caf50",
//             },
//           }}
//           onClick={handleLogin}
//         >
//           {t("login")}
//         </Button>
//       </Paper>
//     </Box>
//   );
// }

// export default LoginPage;
import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Checkbox, FormControlLabel, Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "./component/logo/icon_new.png";
import { useTranslation } from "react-i18next";
import { login } from "./component/api/API";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 200) {
        const data = await res.json();
        const token = data.token;
        const decoded = jwtDecode(token);

        localStorage.setItem("token", token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);

        if (onLoginSuccess) onLoginSuccess(decoded);

        if (decoded?.role === "admin") {
          navigate("/admin");
        } else if (decoded?.role === "user") {
          navigate("/user");
        } else {
          navigate("/");
        }
        window.location.reload();
      } else {
        alert("เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #a8e6cf 0%, #56ab2f 100%)"
    }}>
      {/* ซ้าย */}
      <Box sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#fff",
        p: 4
      }}>
        <Typography variant="h3" fontWeight="bold">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '100%',
              filter: "drop-shadow(0 0 2px #2e7d32)",
            }}
          />
        </Typography>

      </Box>

      {/* เส้นแบ่ง */}
      <Box sx={{
        width: "1px",
        backgroundColor: "rgba(255,255,255,0.4)",
        my: 8
      }} />

      {/* ขวา */}
      <Box sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4
      }}>
        <Box sx={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "rgba(255,255,255,0.9)",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
            {t("login")}
          </Typography>

          <TextField
            fullWidth
            placeholder={t("email")}
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            placeholder={t("password")}
            type="password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <FormControlLabel control={<Checkbox size="small" />} label={t("remember_me")} />
            <Link component="button" variant="body2" onClick={() => navigate("/reset-password")}>
              {t("reset_password")}
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#66bb6a",
              "&:hover": { backgroundColor: "#4caf50" }
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? t("loading") : t("login")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, borderColor: "#66bb6a", color: "#388e3c" }}
            onClick={() => navigate("/signup")}
          >
            {t("signup")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;

