import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, MenuItem, Snackbar, Alert, Link, FormHelperText
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import logo from "./component/logo/icon_new.png";
import { useNavigate } from "react-router-dom";
import { register } from "./component/api/API";

function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordHelper, setPasswordHelper] = React.useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSignUp = async () => {
    setLoading(true)
    if (password.length < 6) {
      setPasswordError(true);
      setPasswordHelper("กรุณากรอกรหัสผ่านขั้นต่ำ 6 ตัว");
      return;
    }
    // ถ้าต้องการ เช็ค confirm password ตรงกันด้วยก็ได้
    if (password !== confirmPassword) {
      setPasswordError(true);
      setPasswordHelper("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ open: true, message: t("password_mismatch"), severity: "error" });
      setLoading(false);
      return;
    }

    try {
      // แปลง role ให้ตรงกับ backend
      let backendRole = role;
      if (role === "entrepreneur") {
        backendRole = "user"; // ใน DB ไม่มี entrepreneur ใช้ user แทน
      }

      const payload = {
        name,
        email,
        password,
        role: backendRole,
        businessName: role === "entrepreneur" ? businessName : "-",
        avatarUrl: "-" // ถ้าภายหลังมีอัพโหลดรูป ค่อยเพิ่มตรงนี้
      };
      console.log("payload", payload);
      console.log(JSON.stringify(payload, null, 2));

      const res = await axios.post(register, payload
        // { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201 || res.status === 200 || res?.dta) {
        setSnackbar({ open: true, message: t("signup_success"), severity: "success" });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setBusinessName("");
      } else {
        setSnackbar({ open: true, message: t("signup_failed"), severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("network_error"), severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 6) {
      setPasswordError(false);
      setPasswordHelper("");
    }
  };


  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      minHeight: "100vh",
      background: "linear-gradient(135deg, #a8e6cf 0%, #56ab2f 100%)"
    }}>
      {/* ฝั่งซ้าย */}
      <Box sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#fff",
        p: { xs: 2, sm: 3, md: 4 },
        maxHeight: { xs: 250, md: "none" }, // จำกัดความสูงบนมือถือ
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '100%',

            filter: "drop-shadow(0 0 2px #2e7d32)",
          }}
        />
      </Box>

      {/* เส้นแบ่ง */}
      <Box sx={{
        width: { xs: "100%", md: "1px" },
        height: { xs: "1px", md: "auto" },
        backgroundColor: "rgba(255,255,255,0.4)",
        my: { xs: 2, md: 8 }
      }} />

      {/* ฝั่งขวา */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "rgba(255,255,255,0.9)",
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
          }}
        >
          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
            {t("signup")}
          </Typography>

          <TextField
            fullWidth select label={t("role")} value={role} onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="guest">{t("guest")}</MenuItem>
            <MenuItem value="entrepreneur">{t("entrepreneur")}</MenuItem>
          </TextField>

          <TextField fullWidth label={t("name")} margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth label={t("email")} margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          {role === "entrepreneur" && (
            <TextField fullWidth label={t("business_name")} margin="normal" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          )}
          <TextField
            fullWidth
            label={t("password")}
            type="password"
            margin="normal"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={onPasswordChange}
            error={passwordError}
            helperText={passwordHelper}
          />
          <TextField
            fullWidth
            label={t("confirm_password")}
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#66bb6a",
              "&:hover": { backgroundColor: "#4caf50" }
            }}
            onClick={handleSignUp}
          >
            {t("signup")}
          </Button>

          <Link
            component="button"
            variant="body2"
            sx={{ display: "block", textAlign: "center", mt: 2 }}
            onClick={() => navigate("/login")}
          >
            {t("back_to_login")}
          </Link>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUpPage;
