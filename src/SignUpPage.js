import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Snackbar,
  Alert,

} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTranslation } from "react-i18next";
import logo from "./component/logo/icon_new.png";
import axios from "axios";

function SignUpPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: t("password_mismatch"),
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: t("สมัครสมาชิกสำเร็จ"),
          severity: "success",
        });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setSnackbar({
          open: true,
          message: `${t("signup_failed")}: ${response.statusText}`,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Register error:", err);
      setSnackbar({
        open: true,
        message: t("network_error"),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e8f5e9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: "#f1f8e9",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 80,

              filter: "drop-shadow(0 0 2px #2e7d32)", // เงาสีเขียวเข้มช่วยให้ภาพดูเด่น
            }}
          />
          {/* <Typography
                   variant="h5"
                   sx={{
                     color: "#388e3c",
                     mt: 1,
                     fontWeight: "bold",
                     fontFamily: "sans-serif",
                   }}
                 >
                   {t("login")}
                 </Typography> */}
        </Box>
        <TextField
          fullWidth
          label={t("name")}
          margin="normal"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label={t("email")}
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label={t("password")}
          type="password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label={t("confirm_password")}
          type="password"
          margin="normal"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#66bb6a",
            "&:hover": { backgroundColor: "#4caf50" },
          }}
          onClick={handleSignUp}
        >
          {t("signup")}
        </Button>
      </Paper>
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
